import React from 'react';
import styled from 'styled-components';
import { Flexbox, PageHeader } from 'components/styled/Layout';
import { TextButton } from 'components/styled/Button';
import useLocalStorage from 'core/localStorage/useLocalStorage';

export default function CollapsableContainer({
  title,
  hideText,
  showText,
  children,
  titleChildren = null,
  localStorageKey
}) {
  const [expanded, setExpanded] = useLocalStorage(localStorageKey, true);

  return (
    <React.Fragment>
      <Flexbox marginBottom="10px" width="100%">
        <CollapsablePageHeader>{title}</CollapsablePageHeader>
        <TextButton
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {expanded ? hideText : showText}
          <i className="material-icons">{expanded ? 'expand_less' : 'expand_more'}</i>
        </TextButton>
        {titleChildren}
      </Flexbox>
      <div style={{ display: expanded ? 'flex' : 'none', flexDirection: 'column', width: '100%' }}>{children}</div>
    </React.Fragment>
  );
}

const CollapsablePageHeader = styled(PageHeader)`
  margin-right: 40px;
`;
