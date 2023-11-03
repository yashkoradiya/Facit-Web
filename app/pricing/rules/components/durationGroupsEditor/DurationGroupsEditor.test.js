import React from 'react';
import { render, waitFor, cleanup, fireEvent, prettyDOM } from 'test-utils';
import DurationGroupsEditor from './DurationGroupsEditor';
import userEvent from '@testing-library/user-event';

let user;
describe('DurationGroupsEditor', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  afterEach(cleanup);
  it('should render each duration group', async () => {
    const { findByText } = render(
      <DurationGroupsEditor
        durationGroups={[
          {
            key: 'first',
            from: 1,
            to: 2
          },
          {
            key: 'second',
            from: 3,
            to: 4
          }
        ]}
        onChange={() => {}}
      />
    );

    expect(await findByText(/^1$/i)).toBeInTheDocument();
    expect(await findByText(/^2$/i)).toBeInTheDocument();
    expect(await findByText(/^3$/i)).toBeInTheDocument();
    expect(await findByText(/^4$/i)).toBeInTheDocument();
  });

  //TODO: Commenting these due to issues with AGGridReact.waitForInstance and it doesn't seem to be updating the dom with the user entered data at assertion phase.
  // it('should call on change handler when adding new duration group', async () => {
  //   const onChangeHandler = jest.fn();
  //   const screen = render(
  //     <DurationGroupsEditor
  //       durationGroups={[
  //         {
  //           key: 'default',
  //           from: 1,
  //           to: 1
  //         }
  //       ]}
  //       onChange={onChangeHandler}
  //     />
  //   );

  //   const text = /add/i;
  //   // await typeInCellWithText(container, text, '2');
  //   const cell = await screen.findByText(text);
  //   await user.click(cell);
  //   const cellInput = screen.getByRole('textbox');
  //   await user.type(cellInput, '2');
  //   fireEvent.keyDown(cellInput, { key: 'Enter', code: 'Enter', charCode: 13 });
  //   console.log('-------Adding first item--------');

  //   // await typeInCellWithPosition(container, 1, 'to', '3');
  //   const rowIndex = 1,
  //     colId = 'to';
  //   const cell2 = screen.container.querySelector(`[row-index="${rowIndex}"] [col-id="${colId}"]`);
  //   await user.click(cell2);
  //   const cellInput2 = screen.getByRole('textbox');
  //   await user.type(cellInput2, '3');
  //   console.log(prettyDOM(cellInput2));
  //   fireEvent.keyDown(cellInput2, { key: 'Enter', code: 'Enter', charCode: 13 });
  //   console.log('-------Adding second item--------');

  //   const assertData = [
  //     expect.objectContaining({ key: expect.any(String), from: 1, to: 1 }),
  //     expect.objectContaining({ key: expect.any(String), from: 2, to: 3 })
  //   ];
  //   await waitFor(() => expect(onChangeHandler).toHaveBeenCalled(), { timeout: 5000 });
  //   // await waitFor(() =>
  //   //   expect(onChangeHandler).toHaveBeenCalledWith([
  //   //     expect.objectContaining({ key: expect.any(String), from: 1, to: 1 }),
  //   //     expect.objectContaining({ key: expect.any(String), from: 2, to: 3 })
  //   //   ])
  //   // );
  // }, 10000);

  // it('should only display error when duration group is invalid', async () => {
  //   const onValidationHandler = jest.fn();
  //   const { typeInCellWithText, findByText, queryByText, container } = render(
  //     <DurationGroupsEditor
  //       durationGroups={[
  //         {
  //           key: 'default',
  //           from: 1,
  //           to: 2
  //         }
  //       ]}
  //       onValidation={onValidationHandler}
  //       onChange={() => {}}
  //     />
  //   );
  //   await waitFor(() => expect(queryByText(/invalid/i)).toBeNull());

  //   await typeInCellWithText(container, /^1$/, '4');

  //   expect(await findByText(/invalid/i)).toBeInTheDocument();
  //   expect(onValidationHandler).toHaveBeenLastCalledWith(false);

  //   await typeInCellWithText(container, /^2$/, '8');

  //   await waitFor(() => expect(queryByText(/invalid/i)).toBeNull());
  //   expect(onValidationHandler).toHaveBeenLastCalledWith(true);
  // });

  it('should handle deleting duration group', async () => {
    const onValidationHandler = jest.fn();
    const onChangeHandler = jest.fn();
    const { findAllByTitle, findByText, queryByText, rerender } = render(
      <DurationGroupsEditor
        durationGroups={[
          {
            key: 'first',
            from: 1,
            to: 2
          },
          {
            key: 'second',
            from: 3,
            to: 4
          }
        ]}
        onValidation={onValidationHandler}
        onChange={onChangeHandler}
      />
    );

    expect(await findByText(/^1$/)).toBeInTheDocument();
    expect(await findByText(/^2$/)).toBeInTheDocument();
    expect(await findByText(/^3$/)).toBeInTheDocument();
    expect(await findByText(/^4$/)).toBeInTheDocument();

    const [firstDeleteButton] = await findAllByTitle(/delete/i);
    await user.click(firstDeleteButton);

    await waitFor(() => expect(onChangeHandler).toHaveBeenCalledTimes(1));

    const updatedDurations = onChangeHandler.mock.calls[0][0];

    rerender(
      <DurationGroupsEditor
        durationGroups={updatedDurations}
        onValidation={onValidationHandler}
        onChange={onChangeHandler}
      />
    );

    await waitFor(() => expect(queryByText(/^1$/)).toBeNull());
    await waitFor(() => expect(queryByText(/^2$/)).toBeNull());
    expect(await findByText(/^3$/)).toBeInTheDocument();
    expect(await findByText(/^4$/)).toBeInTheDocument();

    expect(onValidationHandler).toHaveBeenCalled();
  });
});
