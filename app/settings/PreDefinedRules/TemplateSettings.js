import React from 'react';
import useAuth from 'core/identity/useAuth';
import { Flexbox, PageHeader } from 'components/styled/Layout';
import PreDefinedDateBandRulesEditor from './PreDefinedDateBandRulesEditor';
import PreDefinedDurationGroupRulesEditor from './PreDefinedDurationGroupRulesEditor';

export default function TemplateSettings() {
  const access = useAuth();
  const readOnly = !access.settings.templatesettings.write;

  return (
    <React.Fragment>
      <Flexbox marginBottom="10px">
        <PageHeader>Template settings</PageHeader>
      </Flexbox>
      <Flexbox childrenMarginRight="20px" alignItems="flex-start">
        <PreDefinedDateBandRulesEditor readOnly={readOnly} />
        <PreDefinedDurationGroupRulesEditor readOnly={readOnly} />
      </Flexbox>
    </React.Fragment>
  );
}
