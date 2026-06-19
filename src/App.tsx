import { useState } from 'react';
import { fetchGitHubData, type TransformedData } from './services/githubService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './App.css'; // Asegúrate de tener estilos básicos o usa Tailwind

function App() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState<TransformedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const result = await fetchGitHubData(username);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Visualizador de Actividad en GitHub 📊</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Busca un usuario de GitHub..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ flex: 1, padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '4px' }}>
          Buscar
        </button>
      </form>

      {loading && <p>Cargando datos (procesando ETL)...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Perfil del Usuario */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
            <img src={data.profile.avatar_url} alt="Avatar" width="100" style={{ borderRadius: '50%' }} />
            <div>
              <h2>{data.profile.login}</h2>
              <p>Seguidores: <strong>{data.profile.followers}</strong> | Repos Públicos: <strong>{data.profile.public_repos}</strong></p>
            </div>
          </div>

          {/* Gráfico de Lenguajes (Visualización de datos) */}
          <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
            <h3>Tendencias de Lenguajes</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.languagesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Explorador de Repositorios */}
          <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
            <h3>Top 5 Repositorios (por estrellas)</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {data.topRepos.map(repo => (
                <li key={repo.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#0366d6' }}>
                    {repo.name}
                  </a>
                  <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
                    ⭐ {repo.stargazers_count} | 💻 {repo.language || 'N/A'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;