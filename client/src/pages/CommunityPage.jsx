import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CommunityChat from '../components/Chat/CommunityChat.jsx';
import AppSidebar from '../components/AppSidebar/AppSidebar.jsx';
import { getUserProfile } from '../api/userApi.js';
import { getCommunity } from '../api/communityApi.js';
import './CommunityPage.css';

export default function CommunityPage() {
  const location = useLocation();
  const [currentUser,      setCurrentUser]      = useState(null);
  const [selectedId,       setSelectedId]       = useState(location.state?.communityId ?? null);
  const [activeCommunity,  setActiveCommunity]  = useState(null);
  const [loadingCommunity, setLoadingCommunity] = useState(false);

  useEffect(() => {
    getUserProfile()
      .then(({ userMetadata }) => setCurrentUser({
        _id:      userMetadata.userId._id,
        username: userMetadata.userId.username,
      }))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingCommunity(true);
    setActiveCommunity(null);
    getCommunity(selectedId)
      .then(({ community }) => setActiveCommunity(community))
      .catch(console.error)
      .finally(() => setLoadingCommunity(false));
  }, [selectedId]);

  const loading = loadingCommunity || (!!activeCommunity && !currentUser);
  const ready   = !loading && currentUser && activeCommunity;

  return (
    <div className="community-page">
      <AppSidebar
        selectedCommunityId={selectedId}
        onCommunitySelect={setSelectedId}
      />

      <div className="cp-chat-area">
        {loading && (
          <div className="cp-loading">
            <div className="cp-loading-spinner" />
          </div>
        )}

        {ready && (
          <CommunityChat
            key={activeCommunity._id}
            community={activeCommunity}
            currentUser={currentUser}
          />
        )}

        {!loading && !activeCommunity && (
          <div className="cp-empty-state">
            <div className="cp-empty-icon">⬡</div>
            <p>Select a community to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
