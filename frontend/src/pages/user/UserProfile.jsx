import React from 'react';
import './UserProfile.css'; 
import { useParams} from 'react-router-dom';
export default function UserProfile() {
  const { user ,role,division} = useParams();
  const usert = {
    name: 'Sarah Anderson',
    title: 'Designer UX Senior',
    avatar: 'https://img.freepik.com/vecteurs-libre/cercle-bleu-utilisateur-blanc_78370-4707.jpg?semt=ais_hybrid&w=740',
    bio: 'Passionnée par la création de designs centrés sur l\'humain et la résolution de problèmes complexes à travers des interfaces intuitives.',
    stats: {
      projects: 142,
      followers: '2.4k',
      following: 586
    },
    skills: ['Design UI', 'Recherche UX', 'Prototypage', 'Systèmes de design', 'Tests utilisateur'],
    contact: {
      email: 'sarah.anderson@example.com',
      location: 'San Francisco, CA',
      website: 'www.sarahanderson.design'
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={usert.avatar} alt={usert.name} />
          <div className="online-status"></div>
        </div>
        <h1 className="profile-name">{user}</h1>
        <p className="profile-title">{role =="admin"?"Administrateur général":`Responsable de division de id ${division}`.toLowerCase()}{}</p>
      </div>

    </div>
  );
}