"use client";
import React, { useState } from "react";
import {
  useGetAllMembersQuery,
  useGetMembersByTeamQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} from "@/store/api/memberApi";
import { useGetAllTeamsQuery } from "@/store/api/teamApi";
import type { Member, CreateMemberForm } from "@/store/api/memberApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Plus, Pencil, Trash2, Users, Shield, UserPlus, X } from "lucide-react";

export default function TeamManager() {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Queries
  const { data: teams, isLoading: teamsLoading, isError: teamsError, error: teamsErr } = useGetAllTeamsQuery();
  const { data: members, isLoading: membersLoading, isError: membersError } = useGetAllMembersQuery();
  const { data: teamMembers } = useGetMembersByTeamQuery(String(selectedTeamId ?? 0), {
    skip: !selectedTeamId,
  });

  // Mutations
  const [createMember] = useCreateMemberMutation();
  const [updateMember] = useUpdateMemberMutation();
  const [deleteMember] = useDeleteMemberMutation();

  // Form state
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formTeamId, setFormTeamId] = useState<number | "">("");

  if (teamsLoading) return <p className="text-center p-8">Chargement des équipes...</p>;
  if (teamsError) return <p className="text-center p-8 text-red-500">Erreur : {(teamsErr as FetchBaseQueryError).status}</p>;

  const displayedMembers = selectedTeamId
    ? teamMembers
    : members;

  const resetForm = () => {
    setFormName("");
    setFormRole("");
    setFormTeamId("");
  };

  const handleCreate = async () => {
    if (!formName || !formTeamId) return;
    try {
      await createMember({ name: formName, role: formRole || undefined, team_id: Number(formTeamId) }).unwrap();
      resetForm();
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create member:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedMember) return;
    try {
      await updateMember({
        id: String(selectedMember.id),
        name: formName || undefined,
        role: formRole || undefined,
      }).unwrap();
      resetForm();
      setShowEditModal(false);
      setSelectedMember(null);
    } catch (err) {
      console.error("Failed to update member:", err);
    }
  };

  const handleDelete = async (member: Member) => {
    if (!confirm(`Supprimer ${member.name} ?`)) return;
    try {
      await deleteMember(String(member.id)).unwrap();
    } catch (err) {
      console.error("Failed to delete member:", err);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setFormName(member.name);
    setFormRole(member.role || "");
    setFormTeamId(member.team_id);
    setShowEditModal(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Gestion des Membres
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gérez les membres de chaque équipe
          </p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un membre
        </Button>
      </div>

      {/* Filter by team */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          variant={!selectedTeamId ? "default" : "outline"}
          onClick={() => setSelectedTeamId(null)}
          className="rounded-full"
        >
          Tous
        </Button>
        {teams?.map((team) => (
          <Button
            key={team.id}
            variant={selectedTeamId === Number(team.id) ? "default" : "outline"}
            onClick={() => setSelectedTeamId(Number(team.id))}
            className="rounded-full"
          >
            {team.name}
          </Button>
        ))}
      </div>

      {/* Members Grid */}
      {membersLoading ? (
        <p className="text-center p-8">Chargement des membres...</p>
      ) : membersError ? (
        <p className="text-center p-8 text-red-500">Erreur lors du chargement</p>
      ) : !displayedMembers || displayedMembers.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-xl">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {selectedTeamId ? "Cette équipe n'a pas encore de membres" : "Aucun membre pour le moment"}
          </p>
          <Button onClick={openCreateModal} className="mt-4" variant="outline">
            <UserPlus className="w-4 h-4 mr-2" />
            Ajouter le premier membre
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedMembers.map((member) => {
            const team = teams?.find((t) => Number(t.id) === member.team_id);
            return (
              <div
                key={member.id}
                className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      {member.role && (
                        <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {member.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(member)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {team && (
                  <p className="text-xs text-gray-400 mt-3">
                    Équipe : {team.name}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-500" />
              Ajouter un membre
            </h2>
            <button onClick={() => setShowCreateModal(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nom du membre"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rôle</label>
              <input
                type="text"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                placeholder="ex: Dresseur, Champion, etc."
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Équipe *</label>
              <select
                value={formTeamId}
                onChange={(e) => setFormTeamId(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">Sélectionner une équipe</option>
                {teams?.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleCreate}
              disabled={!formName || !formTeamId}
              className="w-full"
            >
              Ajouter
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Pencil className="w-5 h-5 text-blue-500" />
              Modifier {selectedMember?.name}
            </h2>
            <button onClick={() => setShowEditModal(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rôle</label>
              <input
                type="text"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <Button onClick={handleUpdate} disabled={!formName} className="w-full">
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
