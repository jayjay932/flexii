function HostCard({ host, totalEvaluations }) {
    if (!host) return <p>Aucun hôte trouvé.</p>;
  
    return (
      <div className="host-card">
        <img src={host.avatar_url} alt={host.name} />
        <h3>{host.name} {host.superhost && '★'}</h3>
        <p>{totalEvaluations} évaluations</p>
        <p>Profession: {host.profession}</p>
      </div>
    );
  }
  
  export default HostCard;
  