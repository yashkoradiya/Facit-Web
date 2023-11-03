import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewPricesFooter from './ReviewPricesFooter';

let user;
 describe('ReviewPricesFooter', () => {
    user = userEvent.setup();
  it('should render correctly', () => {
    const { getByText } = render(<ReviewPricesFooter />);
    expect(getByText('Publish selected prices')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });
   it('should call the onPublishPrices function when "Publish selected prices" button is clicked', async() => {
    const onPublishPrices = jest.fn();
    const { getByText } = render(<ReviewPricesFooter onPublishPrices={onPublishPrices} />);
    const publishButton = getByText('Publish selected prices');
     // Simulate a click on the "Publish selected prices" button
    await user.click(publishButton);
    expect(onPublishPrices).toHaveBeenCalled();
  });
   it('should call the onClose function when "Cancel" button is clicked', async() => {
    const onClose = jest.fn();
    const { getByText } = render(<ReviewPricesFooter onClose={onClose} />);
    const cancelButton = getByText('Cancel');
     // Simulate a click on the "Cancel" button
    await user.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });
});