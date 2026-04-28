     1|     1|'use client'
     2|     2|import React from 'react';
     3|     3|import Modal from "../components/ui/modal";
     4|     4|import { useState } from 'react';
     5|     5|import OrbitCarousel from '@/components/ui/orbit-carousel';
     6|     6|import { Pencil, Trash, X, Check, Shield, Star } from "lucide-react";
     7|     7|import { useCreateOneTeamMutation, useDeleteOneTeamMutation, useGetAllTeamsQuery, useRemovePokemonToTeamMutation, useUpdateTeamMutation } from "@/store/api/teamApi";
     8|     8|import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
     9|     9|import type { Team } from "@/store/api/teamApi";
    10|    10|import { Button } from '@/components/ui/button';
    11|    11|
    12|    12|// Max level threshold (500+ total stats = level 5++)
    13|    13|const MAX_LEVEL = 5;
    14|    14|const MAX_TOTAL_STATS = 500;
    15|    15|
    16|    16|// Helper to get progress bar color based on level
    17|    17|function getProgressColor(level: number): string {
    18|    18|  if (level >= 4) return 'bg-green-500';
    19|    19|  if (level >= 2) return 'bg-yellow-500';
    20|    20|  return 'bg-red-500';
    21|    21|}
    22|    22|
    23|    23|// Helper to get level label
    24|    24|function getLevelLabel(level: number): string {
    25|    25|  if (level >= 5) return 'Légendaire';
    26|    26|  if (level >= 4) return 'Élite';
    27|    27|  if (level >= 3) return 'Expert';
    28|    28|  if (level >= 2) return 'Intermédiaire';
    29|    29|  return 'Débutant';
    30|    30|}
    31|    31|
    32|    32|
    33|    33|
    34|    34|export interface TeamMemberCardProps {
    35|    35|  team: Team;
    36|    36|  onClick?: () => void;
    37|    37|}
    38|    38|
    39|    39|//Sub-component for rendering a single team member's card
    40|    40|const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ team, onClick }) => (
    41|    41|  <div onClick={onClick} className="flex shadow-xl border-2 rounded-md flex-col items-center text-center justify-center">
    42|    42|    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{team.name}</h3>
    43|    43|  </div>
    44|    44|);
    45|    45|
    46|    46|// Main component that renders the entire section
    47|    47|const Teams: React.FC = () => {
    48|    48|
    49|    49|  const [showTeamModal, setShowTeamModal] = useState(false);
    50|    50|  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
    51|    51|  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
    52|    52|  const [selectedTeam, setSelectedTeam] = useState<Team>();
    53|    53|  const [teamName, setTeamName] = useState('');
    54|    54|  const [teamDescription, setTeamDescription] = useState('');
    55|    55|  const [editTeamName, setEditTeamName] = useState('');
    56|    56|  const [editTeamDescription, setEditTeamDescription] = useState('');
    57|    57|
    58|    58|  const teamMembers = selectedTeam?.pokemons
    59|    59|
    60|    60|  const { data: teams, isLoading: teamsLoading, isError: teamsIsError, error: teamsError} = useGetAllTeamsQuery();
    61|    61|  const [createTeam, { isLoading, isError }] = useCreateOneTeamMutation();
    62|    62|  const [updateTeam, { isLoading: updateIsLoading, isError: updateIsError }] = useUpdateTeamMutation();
    63|    63|  const [deleteTeam, { isLoading: deleteIsLoading, isError: deleteIsError }] = useDeleteOneTeamMutation();
    64|    64|  const [removePokemon, { isLoading: removeIsLoading }] = useRemovePokemonToTeamMutation();
    65|    65|
    66|    66|  if (teamsLoading || isLoading || updateIsLoading || deleteIsLoading || removeIsLoading) return <p>Chargement...</p>;
    67|    67|  if (teamsIsError || isError || updateIsError || deleteIsError) return <p>Erreur : {(teamsError as FetchBaseQueryError).status}</p>;
    68|    68|
    69|    69|  function handleShowTeam (team: Team) {
    70|    70|    setSelectedTeam(team);
    71|    71|    setShowTeamModal(true);
    72|    72|  }
    73|    73|
    74|    74|  function handleShowCreateTeamForm () {
    75|    75|    setShowCreateTeamModal(true);
    76|    76|  }
    77|    77|
    78|    78|  function handleShowEditTeamForm () {
    79|    79|    if (!selectedTeam) return;
    80|    80|    setEditTeamName(selectedTeam.name);
    81|    81|    setEditTeamDescription(selectedTeam.description);
    82|    82|    setShowEditTeamModal(true);
    83|    83|  }
    84|    84|
    85|    85|  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    86|    86|    e.preventDefault();
    87|    87|    const formData = {
    88|    88|      'name': teamName,
    89|    89|      'description' : teamDescription
    90|    90|    };
    91|    91|
    92|    92|    try {
    93|    93|        const response = await createTeam(formData).unwrap();
    94|    94|        console.log('✅ Équipe créée :', response);
    95|    95|
    96|    96|        // Reset du form et fermeture de la modal
    97|    97|        setShowCreateTeamModal(false);
    98|    98|        setTeamName('');
    99|    99|        setTeamDescription('');
   100|   100|      } catch (err) {
   101|   101|        console.error('❌ Erreur lors de la création de l\'équipe :', err);
   102|   102|      }
   103|   103|  };
   104|   104|
   105|   105|  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   106|   106|    e.preventDefault();
   107|   107|    if (!selectedTeam?.id) return;
   108|   108|
   109|   109|    const formData = {
   110|   110|      name: editTeamName,
   111|   111|      description: editTeamDescription
   112|   112|    };
   113|   113|
   114|   114|    try {
   115|   115|        const response = await updateTeam({ id: selectedTeam.id, body: formData as Team }).unwrap();
   116|   116|        console.log('✅ Équipe modifiée :', response);
   117|   117|
   118|   118|        // Mettre à jour l'équipe sélectionnée localement
   119|   119|        setSelectedTeam(response);
   120|   120|        setShowEditTeamModal(false);
   121|   121|      } catch (err) {
   122|   122|        console.error('❌ Erreur lors de la modification de l\'équipe :', err);
   123|   123|      }
   124|   124|  };
   125|   125|
   126|   126|  async function handleDeleteTeam (selectedTeamId?: string) {
   127|   127|
   128|   128|    if (!selectedTeamId) return;
   129|   129|
   130|   130|    const teamId = String(selectedTeamId);
   131|   131|
   132|   132|    console.log('TEAMID :', teamId)
   133|   133|
   134|   134|    try {
   135|   135|      const response = await deleteTeam( teamId ).unwrap();
   136|   136|      console.log('✅ Équipe supprimée :', response);
   137|   137|      setShowTeamModal(false);
   138|   138|    } catch (err) {
   139|   139|      console.error('❌ Erreur lors de la suppression de l\'équipe :', err);
   140|   140|    }
   141|   141|  }
   142|   142|
   143|   143|  async function handleRemovePokemon (pokemonId: number) {
   144|   144|    if (!selectedTeam?.id) return;
   145|   145|
   146|   146|    try {
   147|   147|      const response = await removePokemon({ idTeam: selectedTeam.id, idPokemon: String(pokemonId) }).unwrap();
   148|   148|      console.log('✅ Pokémon retiré :', response);
   149|   149|      // Mettre à jour l'équipe sélectionnée localement
   150|   150|      setSelectedTeam(response);
   151|   151|    } catch (err) {
   152|   152|      console.error('❌ Erreur lors du retrait du Pokémon :', err);
   153|   153|    }
   154|   154|  }
   155|   155|
   156|   156|  return (
   157|   157|    <section className="font-sans">
   158|   158|      <div className=" relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24 ">
   159|   159|        {/* Section Header */}
   160|   160|        <div className="text-center mb-12 md:mb-16">
   161|   161|          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
   162|   162|            Meet the brains
   163|   163|          </h2>
   164|   164|          <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300">
   165|   165|            These people work on making our product best.
   166|   166|          </p>
   167|   167|        </div>
   168|   168|
   169|   169|        {/* Team Members Grid - Adjusted for 12 members */}
   170|   170|        <div  className=" gap-6 p-4 border rounded-2xl shadow-2xl">
   171|   171|          <ul className=''>
   172|   172|          {teams?.map((team) => (
   173|   173|            
   174|   174|            <li className='text-center items-center'>
   175|   175|              <TeamMemberCard onClick={() => handleShowTeam(team)} key={team.name} team={team} />  
   176|   176|            </li>
   177|   177|           
   178|   178|          ))}
   179|   179|          </ul>
   180|   180|        </div>
   181|   181|          <Button onClick={handleShowCreateTeamForm} className='w-full'>+</Button>
   182|   182|              <Modal
   183|   183|                isOpen={showTeamModal}
   184|   184|                onClose={() => setShowTeamModal(false)}
   185|   185|                title={`${selectedTeam?.name}`}
   186|   186|              >
   187|   187|                <h1 className='text-center'>{selectedTeam?.description}</h1>
   188|   188|                <div className="flex justify-center gap-2 mt-4">
   189|   189|                  <Button onClick={handleShowEditTeamForm} variant="outline"><Pencil/></Button>
   190|   190|                  <Button onClick={() => handleDeleteTeam(selectedTeam?.id)} variant="destructive"><Trash/></Button>
   191|   191|                </div>
   192|   192|                <OrbitCarousel teamMembers={teamMembers} onRemovePokemon={handleRemovePokemon} />
   193|   193|              </Modal>
   194|   194|              <Modal
   195|   195|                isOpen={showCreateTeamModal}
   196|   196|                onClose={() => setShowCreateTeamModal(false)}
   197|   197|                title={"Création d'une équipe"}
   198|   198|              >
   199|   199|                <div className=''>
   200|   200|                  <form onSubmit={handleSubmit} className='space-y-4'>
   201|   201|                    <div>
   202|   202|                      <label>Saisissez le nom de l'équipe</label>
   203|   203|                      <input 
   204|   204|                        type="text"
   205|   205|                        autoComplete='username'
   206|   206|                        value={teamName}
   207|   207|                        onChange={(e) => setTeamName(e.target.value)}
   208|   208|                        required
   209|   209|                        placeholder="Team Roquette"
   210|   210|                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
   211|   211|                        >
   212|   212|                      </input>
   213|   213|                    </div>
   214|   214|                    <div className='space-y-1'>
   215|   215|                      <label >Redigez une courte déscription</label>
   216|   216|                      <input 
   217|   217|                        placeholder="Description"
   218|   218|                        type="text"
   219|   219|                        autoComplete='username'
   220|   220|                        value={teamDescription}
   221|   221|                        onChange={(e) => setTeamDescription(e.target.value)}
   222|   222|                        required
   223|   223|                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
   224|   224|                        >    
   225|   225|                      </input>
   226|   226|                    </div>
   227|   227|                    <div>
   228|   228|                      <Button>Créer</Button>
   229|   229|                    </div>
   230|   230|                  </form>
   231|   231|                </div>
   232|   232|              </Modal>
   233|   233|              <Modal
   234|   234|                isOpen={showEditTeamModal}
   235|   235|                onClose={() => setShowEditTeamModal(false)}
   236|   236|                title={"Modifier l'équipe"}
   237|   237|              >
   238|   238|                <div className=''>
   239|   239|                  <form onSubmit={handleEditSubmit} className='space-y-4'>
   240|   240|                    <div>
   241|   241|                      <label>Saisissez le nom de l'équipe</label>
   242|   242|                      <input 
   243|   243|                        type="text"
   244|   244|                        autoComplete='username'
   245|   245|                        value={editTeamName}
   246|   246|                        onChange={(e) => setEditTeamName(e.target.value)}
   247|   247|                        required
   248|   248|                        placeholder="Team Roquette"
   249|   249|                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
   250|   250|                        >
   251|   251|                      </input>
   252|   252|                    </div>
   253|   253|                    <div className='space-y-1'>
   254|   254|                      <label >Redigez une courte déscription</label>
   255|   255|                      <input 
   256|   256|                        placeholder="Description"
   257|   257|                        type="text"
   258|   258|                        autoComplete='username'
   259|   259|                        value={editTeamDescription}
   260|   260|                        onChange={(e) => setEditTeamDescription(e.target.value)}
   261|   261|                        required
   262|   262|                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
   263|   263|                        >    
   264|   264|                      </input>
   265|   265|                    </div>
   266|   266|                    <div className="flex justify-end gap-2">
   267|   267|                      <Button type="button" variant="outline" onClick={() => setShowEditTeamModal(false)}><X/> Annuler</Button>
   268|   268|                      <Button type="submit"><Check/> Enregistrer</Button>
   269|   269|                    </div>
   270|   270|                  </form>
   271|   271|                </div>
   272|   272|              </Modal>
   273|   273|      </div>
   274|   274|    </section>
   275|   275|  );
   276|   276|};
   277|   277|
   278|   278|export default Teams;
   279|   279|