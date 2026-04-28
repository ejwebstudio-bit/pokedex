'use client'
import React from 'react';
import Modal from "../components/ui/modal";
import { useState } from 'react';
import OrbitCarousel from '@/components/ui/orbit-carousel';
import { Pencil, Trash, X, Check, Shield, Star } from "lucide-react";
import { useCreateOneTeamMutation, useDeleteOneTeamMutation, useGetAllTeamsQuery, useRemovePokemonToTeamMutation, useUpdateTeamMutation } from "@/store/api/teamApi";
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { Team } from "@/store/api/teamApi";
import { Button } from '@/components/ui/button';

// Max level threshold (500+ total stats = level 5++)
const MAX_LEVEL = 5;
const MAX_TOTAL_STATS = 500;

// Helper to get progress bar color based on level
function getProgressColor(level: number): string {
  if (level >= 4) return 'bg-green-500';
  if (level >= 2) return 'bg-yellow-500';
  return 'bg-red-500';
}

// Helper to get level label
function getLevelLabel(level: number): string {
  if (level >= 5) return 'Légendaire';
  if (level >= 4) return 'Élite';
  if (level >= 3) return 'Expert';
  if (level >= 2) return 'Intermédiaire';
  return 'Débutant';
}

export interface TeamMemberCardProps {
  team: Team;
  onClick?: () => void;
}

//Sub-component for rendering a single team member's card
const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ team, onClick }) => (
  <div onClick={onClick} className="flex shadow-xl border-2 rounded-md flex-col items-center text-center justify-center">
    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{team.name}</h3>
  </div>
);

// Main component that renders the entire section
const Teams: React.FC = () => {

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamDescription, setEditTeamDescription] = useState('');

  const teamMembers = selectedTeam?.pokemons

  const { data: teams, isLoading: teamsLoading, isError: teamsIsError, error: teamsError} = useGetAllTeamsQuery();
  const [createTeam, { isLoading, isError }] = useCreateOneTeamMutation();
  const [updateTeam, { isLoading: updateIsLoading, isError: updateIsError }] = useUpdateTeamMutation();
  const [deleteTeam, { isLoading: deleteIsLoading, isError: deleteIsError }] = useDeleteOneTeamMutation();
  const [removePokemon, { isLoading: removeIsLoading }] = useRemovePokemonToTeamMutation();

  if (teamsLoading || isLoading || updateIsLoading || deleteIsLoading || removeIsLoading) return <p>Chargement...</p>;
  if (teamsIsError || isError || updateIsError || deleteIsError) return <p>Erreur : {(teamsError as FetchBaseQueryError).status}</p>;

  function handleShowTeam (team: Team) {
    setSelectedTeam(team);
    setShowTeamModal(true);
  }

  function handleShowCreateTeamForm () {
    setShowCreateTeamModal(true);
  }

  function handleShowEditTeamForm () {
    if (!selectedTeam) return;
    setEditTeamName(selectedTeam.name);
    setEditTeamDescription(selectedTeam.description);
    setShowEditTeamModal(true);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      'name': teamName,
      'description' : teamDescription
    };

    try {
        const response = await createTeam(formData).unwrap();
        console.log('✅ Équipe créée :', response);

        // Reset du form et fermeture de la modal
        setShowCreateTeamModal(false);
        setTeamName('');
        setTeamDescription('');
      } catch (err) {
        console.error('❌ Erreur lors de la création de l\'équipe :', err);
      }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTeam?.id) return;

    const formData = {
      name: editTeamName,
      description: editTeamDescription
    };

    try {
        const response = await updateTeam({ id: selectedTeam.id, body: formData as Team }).unwrap();
        console.log('✅ Équipe modifiée :', response);

        // Mettre à jour l'équipe sélectionnée localement
        setSelectedTeam(response);
        setShowEditTeamModal(false);
      } catch (err) {
        console.error('❌ Erreur lors de la modification de l\'équipe :', err);
      }
  };

  async function handleDeleteTeam (selectedTeamId?: string) {

    if (!selectedTeamId) return;

    const teamId = String(selectedTeamId);

    console.log('TEAMID :', teamId)

    try {
      const response = await deleteTeam( teamId ).unwrap();
      console.log('✅ Équipe supprimée :', response);
      setShowTeamModal(false);
    } catch (err) {
      console.error('❌ Erreur lors de la suppression de l\'équipe :', err);
    }
  }

  async function handleRemovePokemon (pokemonId: number) {
    if (!selectedTeam?.id) return;

    try {
      const response = await removePokemon({ idTeam: selectedTeam.id, idPokemon: String(pokemonId) }).unwrap();
      console.log('✅ Pokémon retiré :', response);
      // Mettre à jour l'équipe sélectionnée localement
      setSelectedTeam(response);
    } catch (err) {
      console.error('❌ Erreur lors du retrait du Pokémon :', err);
    }
  }

  return (
    <section className="font-sans">
      <div className=" relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24 ">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Meet the brains
          </h2>
          <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300">
            These people work on making our product best.
          </p>
        </div>

        {/* Team Members Grid - Adjusted for 12 members */}
        <div  className=" gap-6 p-4 border rounded-2xl shadow-2xl">
          <ul className=''>
          {teams?.map((team) => (
            
            <li className='text-center items-center'>
              <TeamMemberCard onClick={() => handleShowTeam(team)} key={team.name} team={team} />  
            </li>
           
          ))}
          </ul>
        </div>
          <Button onClick={handleShowCreateTeamForm} className='w-full'>+</Button>
              <Modal
                isOpen={showTeamModal}
                onClose={() => setShowTeamModal(false)}
                title={`${selectedTeam?.name}`}
              >
                <h1 className='text-center'>{selectedTeam?.description}</h1>
                <div className="flex justify-center gap-2 mt-4">
                  <Button onClick={handleShowEditTeamForm} variant="outline"><Pencil/></Button>
                  <Button onClick={() => handleDeleteTeam(selectedTeam?.id)} variant="destructive"><Trash/></Button>
                </div>
                <OrbitCarousel teamMembers={teamMembers} onRemovePokemon={handleRemovePokemon} />
              </Modal>
              <Modal
                isOpen={showCreateTeamModal}
                onClose={() => setShowCreateTeamModal(false)}
                title={"Création d'une équipe"}
              >
                <div className=''>
                  <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                      <label>Saisissez le nom de l'équipe</label>
                      <input 
                        type="text"
                        autoComplete='username'
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                        placeholder="Team Roquette"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        >
                      </input>
                    </div>
                    <div className='space-y-1'>
                      <label >Redigez une courte déscription</label>
                      <input 
                        placeholder="Description"
                        type="text"
                        autoComplete='username'
                        value={teamDescription}
                        onChange={(e) => setTeamDescription(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        >    
                      </input>
                    </div>
                    <div>
                      <Button>Créer</Button>
                    </div>
                  </form>
                </div>
              </Modal>
              <Modal
                isOpen={showEditTeamModal}
                onClose={() => setShowEditTeamModal(false)}
                title={"Modifier l'équipe"}
              >
                <div className=''>
                  <form onSubmit={handleEditSubmit} className='space-y-4'>
                    <div>
                      <label>Saisissez le nom de l'équipe</label>
                      <input 
                        type="text"
                        autoComplete='username'
                        value={editTeamName}
                        onChange={(e) => setEditTeamName(e.target.value)}
                        required
                        placeholder="Team Roquette"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        >
                      </input>
                    </div>
                    <div className='space-y-1'>
                      <label >Redigez une courte déscription</label>
                      <input 
                        placeholder="Description"
                        type="text"
                        autoComplete='username'
                        value={editTeamDescription}
                        onChange={(e) => setEditTeamDescription(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        >    
                      </input>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowEditTeamModal(false)}><X/> Annuler</Button>
                      <Button type="submit"><Check/> Enregistrer</Button>
                    </div>
                  </form>
                </div>
              </Modal>
      </div>
    </section>
  );
};

export default Teams;
