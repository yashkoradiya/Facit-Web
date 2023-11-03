import React from 'react';
import { StyledTable, TableHeader, TableRow, TableHead, TableBody, TableCell, Flexbox } from 'components/styled/Layout';
import { IconButton, PrimaryButton, Button } from 'components/styled/Button';
import { Edit, Clear } from '@material-ui/icons';
import { useState } from 'react';
import moment from 'moment';
import { getDateFormat } from '../../../../helpers/dateHelper';

export default function AccommodationComments({
  readOnly,
  commentData,
  onUpdateComment,
  onAddComment,
  onDeleteComment
}) {
  const [editText, setEditText] = useState('');
  const [editButtonText, setEditButtonText] = useState('Add Comment');
  const [editId, setEditId] = useState();
  console.log(readOnly);
  const copyDataToTextArea = comment => {
    setEditText(comment.comment);
    setEditId(comment.id);
    setEditButtonText('Update Comment');
  };

  const onClickDelete = (id, comment) => {
    setEditText('');
    setEditButtonText('Add Comment');
    if (confirm(`You are about to delete the following comment:\n "${comment}"`)) {
      onDeleteComment(id);
    }
  };

  const onUpdateCommentText = event => {
    setEditText(event.target.value);
  };

  const handleUpdateClick = () => {
    if (editButtonText == 'Add Comment') {
      onAddComment({ comment: editText });
    } else {
      onUpdateComment({ id: editId, comment: editText });
    }
    setEditText('');
    setEditButtonText('Add Comment');
  };

  const handleClearClick = () => {
    setEditButtonText('Add Comment');
    setEditText('');
  };
  {
    /* <style>
  textarea{
     white-space: pre-line,
  }
</style> */
  }
  return (
    <React.Fragment>
      <Flexbox alignItems="flex-start" style={{ marginTop: 16 }}>
        {!readOnly && (
          <Flexbox alignItems="flex-end" direction="column" style={{ marginRight: 10 }}>
            <textarea
              value={editText}
              placeholder="Write comment..."
              style={{ marginBottom: 16, width: 300, height: 100 }}
              onChange={onUpdateCommentText}
              onKeyPress={e => {
                if (e.key === 'Enter') e.preventDefault();
              }}
            ></textarea>
            <Flexbox>
              <PrimaryButton onClick={handleUpdateClick} style={{ marginRight: 5 }}>
                {editButtonText}
              </PrimaryButton>
              <Button onClick={handleClearClick}>Clear</Button>
            </Flexbox>
          </Flexbox>
        )}
        <StyledTable style={{ marginBottom: 16, width: '100%' }}>
          <TableHeader>
            <TableRow>
              <TableHead>Created</TableHead>
              <TableHead>By</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Contract version</TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commentData.map((comment, i) => (
              <TableRow key={i}>
                <TableCell style={{ width: '120px' }}>{moment(comment.created).format(getDateFormat(3))} </TableCell>
                <TableCell style={{ width: '150px' }}>{comment.createdBy}</TableCell>
                <TableCell>{comment.comment}</TableCell>
                <TableCell style={{ width: '130px' }}>
                  v{comment.contractVersion} {moment(comment.contractDate).format(getDateFormat())}
                </TableCell>

                <TableCell style={{ width: '20px' }}>
                  {!readOnly && (
                    <IconButton marginLeft="10px" title="Edit Comment" onClick={() => copyDataToTextArea(comment)}>
                      <Edit fontSize="inherit" />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell style={{ width: '20px' }}>
                  {!readOnly && (
                    <IconButton
                      marginLeft="10px"
                      title="Delete Comment"
                      onClick={() => onClickDelete(comment.id, comment.comment)}
                    >
                      <Clear fontSize="inherit" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Flexbox>
    </React.Fragment>
  );
}
