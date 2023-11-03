import React, { useState, useEffect, useCallback } from 'react';
import * as api from './api';
import UserRoles from './UserRoles';
import UserAccess from './UserAccess';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import CustomizeModal from './CustomizeModal';
import Spinner from 'components/Spinner';

export default function UserManagement() {
  const [userRoles, setUserRoles] = useState([]);
  const [userRegions, setUserRegions] = useState([]);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customizedAccessGroup, setCustomizedAccessGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeUserRolesData();
    initializeUserRegionsData();
    initializeUserAccessData();
  }, [initializeUserRolesData, initializeUserRegionsData, initializeUserAccessData]);

  const initializeUserRolesData = useCallback(async () => {
    const response = await api.getUserRoles();
    setUserRoles(response.data);
  }, []);

  const initializeUserRegionsData = useCallback(async () => {
    const response = await api.getUserRegions();
    setUserRegions(response.data);
  }, []);

  const initializeUserAccessData = useCallback(async () => {
    const response = await api.getUsers();
    setUsers(response.data);
  }, []);

  const updateUser = (roleIds, regionIds) => {
    setLoading(true);
    const { subjectId } = editUser;
    const promises = Promise.all([
      api.assignUserRoles(subjectId, roleIds),
      api.assignUserRegions(subjectId, regionIds)
    ]);
    promises
      .then(() => {
        setEditUser(false);
        initializeUserRolesData();
        initializeUserRegionsData();
        initializeUserAccessData();
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteUser = user => {
    return api.deleteUser(user.subjectId).then(() => {
      setDeleteUser(null);
      initializeUserRolesData();
      initializeUserAccessData();
    });
  };

  const handleAddUserRole = roleName => {
    if (roleName == null || roleName.trim() === '') return;
    return api.createUserRole(roleName).then(() => {
      initializeUserRolesData();
      initializeUserAccessData();
    });
  };

  const handleRoleDelete = id => {
    if (id == null) return;
    return api.deleteUserRole(id).then(() => {
      initializeUserRolesData();
      initializeUserAccessData();
    });
  };

  const handleRoleUpdate = (id, value) => {
    setIsSaving(true);
    return api.roleUpdate(id, value).then(() => {
      initializeUserRolesData();
      initializeUserAccessData();
      setIsSaving(false);
    });
  };

  const handleCustomizedSave = (id, claims) => {
    handleRoleUpdate(id, claims);
    setShowModal(false);
  };

  const handleModalOpen = (id, category, headerName) => {
    setShowModal(true);
    setCustomizedAccessGroup({
      id,
      subcategories: category.subcategories,
      headerName,
      claimPrefix: category.category
    });
  };
  const selectableUserRoles = userRoles.map(x => ({ id: x.id, name: x.name }));
  const selectableUserRegions = userRegions.map(x => ({ id: x.id, name: x.name }));

  return (
    <div style={{ width: '100%' }}>
      {showModal && (
        <CustomizeModal
          onSave={handleCustomizedSave}
          onClose={() => {
            initializeUserRolesData();
            setShowModal(false);
          }}
          show={showModal}
          customizedAccessGroup={customizedAccessGroup}
        />
      )}
      <Spinner loading={loading} />
      <UserRoles
        userRoles={userRoles}
        onRoleDelete={handleRoleDelete}
        onAddUserRole={handleAddUserRole}
        onRoleUpdated={handleRoleUpdate}
        onModalOpen={handleModalOpen}
        saving={isSaving}
      />
      <UserAccess
        selectableUserRoles={selectableUserRoles}
        users={users}
        onEditUser={u => setEditUser(u)}
        onDeleteUser={u => setDeleteUser(u)}
      />
      <EditUserModal
        user={editUser}
        roles={selectableUserRoles}
        regions={selectableUserRegions}
        show={!!editUser}
        onClose={() => setEditUser(null)}
        onSave={(roleIds, regionIds) => updateUser(roleIds, regionIds)}
      />
      <DeleteUserModal
        user={deleteUser}
        show={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onDelete={() => handleDeleteUser(deleteUser)}
      />
    </div>
  );
}
