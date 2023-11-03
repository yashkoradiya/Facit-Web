import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccommodationComments from './AccommodationComments';

let user;

describe('AccommodationComments', () => {
  beforeEach(() => {
    user = userEvent.setup();
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    window.confirm.mockRestore();
  });

  it('should render comments and interact with them', async () => {
    const onUpdateComment = jest.fn();
    const onAddComment = jest.fn();
    const onDeleteComment = jest.fn();

    const commentData = [
      {
        id: 1,
        comment: 'Test comment',
        createdBy: 'John Doe',
        created: '2023-06-01',
        contractVersion: '1.0',
        contractDate: '2023-05-31',
      },
    ];

    render(
      <AccommodationComments
        readOnly={false}
        commentData={commentData}
        onUpdateComment={onUpdateComment}
        onAddComment={onAddComment}
        onDeleteComment={onDeleteComment}
      />
    );

    // Verify rendering of comment data
    const commentElement = screen.getByText(commentData[0].comment);
    expect(commentElement).toBeInTheDocument();

    // Verify edit comment functionality
    const editCommentButton = screen.getByTitle('Edit Comment');
    await user.click(editCommentButton);

    // Verify edit textarea and update functionality
    const textareaElement = screen.getByPlaceholderText('Write comment...');
    expect(textareaElement).toBeInTheDocument();

    await user.type(textareaElement, 'Updated comment');

    const updateButton = screen.getByText('Update Comment');
    await user.click(updateButton);
    const updatedComment = `${commentData[0].comment}Updated comment`;
    expect(onUpdateComment).toHaveBeenCalledWith({ id: commentData[0].id, comment: updatedComment });




    // Verify delete comment functionality
    const deleteCommentButton = screen.getByTitle('Delete Comment');
    await user.click(deleteCommentButton);

    // Verify confirmation dialog
    expect(window.confirm).toHaveBeenCalledWith(
      `You are about to delete the following comment:\n "${commentData[0].comment}"`
    );

    expect(onDeleteComment).toHaveBeenCalledWith(commentData[0].id);

    // Verify adding a new comment
    const addCommentTextarea = screen.getByPlaceholderText('Write comment...');
    await user.type(addCommentTextarea, 'New comment');
    const addCommentButton = screen.getByText('Add Comment');
    await user.click(addCommentButton);
    expect(onAddComment).toHaveBeenCalledWith({ comment: 'New comment' });

    // Verify clearing the comment textarea
    const clearButton = screen.getByText('Clear');
    await user.click(clearButton);
    expect(addCommentTextarea.value).toBe('');

    // Verify code coverage
    expect(onUpdateComment).toHaveBeenCalledTimes(1);
    expect(onAddComment).toHaveBeenCalledTimes(1);
    expect(onDeleteComment).toHaveBeenCalledTimes(1);
  });
});
