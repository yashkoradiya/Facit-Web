import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import NotificationImportant from '@material-ui/icons/Notifications';
import * as constants from './constants';

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

export default function Announcements() {
  const announcements = useSelector(state => state.announcements.announcementQueue);
  const dispatch = useDispatch();

  if (announcements.length === 0) return null;

  const closeAnnouncement = id => {
    dispatch({
      type: constants.REMOVE_ANNOUNCEMENT,
      payload: { id }
    });
  };

  const announcement = announcements[0];
  return (
    <Snackbar
      anchorOrigin={{
        vertical: announcement.type === 'Danger' ? 'center' : 'bottom',
        horizontal: 'center'
      }}
      key={announcement.id}
      open={true}
      TransitionComponent={TransitionRight}
    >
      <StyledSnackbarContent
        onClose={() => closeAnnouncement(announcement.id)}
        message={
          <SnackbarMessage id="message-id">
            <IconWrapper type={announcement.type}>
              <NotificationImportant />
            </IconWrapper>
            {announcement.message}
          </SnackbarMessage>
        }
        action={[
          <IconButton key="close" aria-label="Close" color="inherit" onClick={() => closeAnnouncement(announcement.id)}>
            <CloseIcon />
          </IconButton>
        ]}
      ></StyledSnackbarContent>
    </Snackbar>
  );
}

const IconWrapper = styled.span`
  color: ${props => (props.type === 'Danger' ? 'red' : props.type === 'Warning' ? 'yellow' : 'white')};
`;

const SnackbarMessage = styled.span`
  display: flex;
  align-items: center;

  ${IconWrapper} {
    margin-right: 12px;
  }
`;

const StyledSnackbarContent = styled(SnackbarContent)`
  flex-wrap: nowrap !important;
`;
