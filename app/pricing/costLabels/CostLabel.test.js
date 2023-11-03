import React from 'react';
import { render, fireEvent, screen, waitFor } from 'test-utils';
import { act } from 'react-dom/test-utils';
import CostLabels from './index';
import * as api from './api';
import { Record } from 'immutable';
import { userStateTD } from 'appState/appState-testdata';
import userEvent from '@testing-library/user-event';

jest.mock('./api');

const initialState = {
  appState: new (Record({
    user: userStateTD
  }))()
};

let user;
describe('CostLabels', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  const mockCostLabels = [
    { id: 1, name: 'Label 1' },
    { id: 2, name: 'Label 2' },
    { id: 3, name: 'Label 3' }
  ];

  beforeEach(() => {
    api.getCostLabels.mockResolvedValue({ data: mockCostLabels });
    api.createCostLabel.mockResolvedValue({ data: [] });
    api.updateCostLabel.mockResolvedValue({ data: [] });
  });

  test('renders the cost labels', async () => {
    render(<CostLabels />, initialState);
    await waitFor(() => {
      expect(screen.getByRole('textbox', { value: 'Label 1' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { value: 'Label 2' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { value: 'Label 3' })).toBeInTheDocument();
    });
  });

  test('adds a new cost label', async () => {
    const { getByPlaceholderText } = render(<CostLabels />, initialState);
    const newCostLabelInput = getByPlaceholderText('New cost label');
    await user.type(newCostLabelInput, 'New Label');
    await user.keyboard('{Enter}');
    await user.click(
      screen.getByRole('button', {
        name: /save/i
      })
    );
  });

  test('deletes a cost label', async () => {
    const { queryByText } = render(<CostLabels />, initialState);
    await waitFor(async () => {
      const deleteButton = screen.getAllByRole('button', { title: 'Delete' })[0];
      await user.click(deleteButton);
    });
    await act(async () => {
      await waitFor(() => {
        expect(queryByText('Label 1')).not.toBeInTheDocument();
      });
    });
  });

  test('updates a cost label', async () => {
    render(<CostLabels />, initialState);
    await waitFor(() => screen.getAllByTitle('Edit'));
    const editButton = screen.getAllByTitle('Edit')[0];
    await user.click(editButton);

    const inputField = screen.getAllByRole('textbox').find(field => field.value === 'Label 1');
    await user.type(inputField, 'Updated Label');
    fireEvent.keyUp(inputField, { key: 'Enter', code: 'Enter', charCode: 13 });

    const saveButton = screen.getAllByRole('button').find(button => button.title === 'Save');
    await user.click(saveButton);
  });
});
