import React from 'react';
import useAuth from 'core/identity/useAuth';
import { Flexbox, PageHeader } from 'components/styled/Layout';
import DiscountTemplateOverview from './DiscountTemplateOverview';

export default function Discounts() {
  const access = useAuth();

  const readOnly = !access.settings.discounts.write;
  return (
    <React.Fragment>
      <Flexbox marginBottom="10px">
        <PageHeader>Discounts</PageHeader>
      </Flexbox>
      <Flexbox justifyContent="space-between" alignItems="flex-start">
        <DiscountTemplateOverview readOnly={readOnly} />
      </Flexbox>
    </React.Fragment>
  );
}
