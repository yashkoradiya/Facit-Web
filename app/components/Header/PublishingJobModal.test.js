import React from 'react';
import { render } from '@testing-library/react';
import PublishingJobModal from './PublishingJobModal';

describe('PublishingJobModal', () => {
  const mockData = [
    // your mock data here
  ];

  const mockColumnDefinitions = [
    // your mock column definitions here
  ];

  it('renders modal with correct title', () => {
    const { getByText } = render(
      <PublishingJobModal
        width={800}
        show={true}
        data={mockData}
        columnDefinitions={mockColumnDefinitions}
        onRequestClose={() => {}}
        jobType="someJobType"
      />
    );

    const modalTitle = getByText('Publish Status');
    expect(modalTitle).toBeInTheDocument();
  });

  it('renders modal with correct alternative title', () => {
    const { container } = render(
      <PublishingJobModal
        width={800}
        show={true}
        data={mockData}
        columnDefinitions={mockColumnDefinitions}
        onRequestClose={() => {}}
        jobType="someEvaluateJobType"
      />
    );
  
    const modalTitle = container.querySelector('Evaluate Status');
    expect(modalTitle).toBeNull();
  });
  

  it('renders AgGridReact component', () => {
    const { container } = render(
      <PublishingJobModal
        width={800}
        show={true}
        data={mockData}
        columnDefinitions={mockColumnDefinitions}
        onRequestClose={() => {}}
        jobType="someJobType"
      />
    );

    const agGridComponent = container.querySelector('.ag-theme-balham');
    expect(agGridComponent).toBeInTheDocument();
  });
});
