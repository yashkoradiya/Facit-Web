import React, { useState, useEffect } from 'react';
import ModalBase from 'components/ModalBase';
import { PrimaryButton, Button } from 'components/styled/Button';
import { Flexbox } from 'components/styled/Layout';
import DropdownMenu from 'components/FormFields/DropdownMenu';
import { getClaimAccess } from './UserRoles';

export default function CustomizeModal({ show, onClose, onSave, customizedAccessGroup }) {
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (customizedAccessGroup) {
      setSubcategories(
        customizedAccessGroup.subcategories.map(x => {
          return {
            category: x.category,
            name: x.name,
            access: x.access
          };
        })
      );
    }
  }, [customizedAccessGroup]);

  const handleChange = (access, category) => {
    let updatedCategories = [...subcategories];
    let subcategory = updatedCategories.find(x => x.category === category);
    subcategory.access = access;

    setSubcategories(updatedCategories);
  };

  const handleSave = () => {
    const claims = subcategories.map(
      subcategory =>
        `${customizedAccessGroup.claimPrefix}.${subcategory.category}.${getClaimAccess(subcategory.access)}`
    );
    onSave(customizedAccessGroup.id, claims);
  };

  return (
    <ModalBase
      width={'500px'}
      show={show}
      onRequestClose={onClose}
      title={`${customizedAccessGroup?.headerName} - Customized Access`}
    >
      {show && customizedAccessGroup && (
        <Flexbox height="100%" direction="column" alignItems="flex-start" justifyContent="space-between">
          {subcategories.length > 0 && (
            <div direction="column" style={{ marginBottom: '15px' }}>
              <table>
                <tbody>
                  {subcategories.map((sub, index) => (
                    <tr key={index}>
                      <td>{sub.name}</td>
                      <td>
                        <DropdownMenu
                          onChange={change => handleChange(change.value, sub.category)}
                          defaultValue={sub.access}
                          items={getDropdownValues()}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Flexbox alignSelf="flex-end">
            <PrimaryButton marginRight="10px" onClick={handleSave}>
              Save and return
            </PrimaryButton>
            <Button onClick={onClose}>Cancel</Button>
          </Flexbox>
        </Flexbox>
      )}
    </ModalBase>
  );
}

function getDropdownValues() {
  return [
    {
      key: 'Edit',
      value: 'Edit'
    },
    {
      key: 'Read',
      value: 'Read'
    },
    {
      key: 'NoAccess',
      value: 'NoAccess'
    }
  ];
}
