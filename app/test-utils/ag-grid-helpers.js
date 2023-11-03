import { fireEvent, findByText, findByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

//TODO: These methods are buggy and some tests are working with these with wrong assertions.
const typeInCellWithText = async (container, text, input) => {
  const cell = await findByText(container, text);
  await typeInCell(container, cell, input);
};

const typeInCellWithPosition = async (container, rowIndex, colId, input) => {
  await typeInCellWithSelector(container, `[row-index="${rowIndex}"] [col-id="${colId}"]`, input);
};

const typeInCellWithSelector = async (container, selector, input) => {
  const cell = container.querySelector(selector);
  await typeInCell(container, cell, input);
};

const typeInCell = async (container, cell, input) => {
  const user = userEvent.setup();
  await user.dblClick(cell);
  const cellInput = container.querySelector('.ag-cell-editor');
  await user.type(cellInput, input);
  fireEvent.keyDown(cellInput, { keyCode: 13 });
};

export const agGridQueries = {
  typeInCellWithText,
  typeInCellWithPosition,
  typeInCellWithSelector
};
