import React, { useState, useEffect } from 'react';

// This is the main App component that contains the tab structure.
// All components and logic are kept in this single file for simplicity.
const App = () => {
  // Application state
  const [activeTab, setActiveTab] = useState('Problem Tracker');
  const [patterns, setPatterns] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [isAddingPattern, setIsAddingPattern] = useState(false);
  const [isEditingPattern, setIsEditingPattern] = useState(false);
  const [editingPatternData, setEditingPatternData] = useState(null);
  const [isEditingJournalEntry, setIsEditingJournalEntry] = useState(false);
  const [editingJournalData, setEditingJournalData] = useState(null);
  
  const [newPatternTitle, setNewPatternTitle] = useState('');
  const [newPatternDescription, setNewPatternDescription] = useState('');
  const [newPatternDifficulty, setNewPatternDifficulty] = useState('');
  // New state for pattern code
  const [newPatternCode, setNewPatternCode] = useState('');

  const [newProblem, setNewProblem] = useState({
    title: '',
    platform: '',
    difficulty: '',
    time: '',
    attempts: '',
    topic: '',
    rating: '',
    notes: '',
    // New field for problem code
    code: ''
  });
  const [patternFilter, setPatternFilter] = useState('All');
  const [journalFilter, setJournalFilter] = useState('All');
  
  // Static goals for now, can be made configurable later
  const weeklyGoal = 10;
  const monthlyGoal = 30;

  // Define the tabs for the navigation
  const tabs = [
    { title: 'Problem Tracker', content: 'Add new coding problems you did.' },
    { title: 'Coding Patterns', content: 'Explore and manage your library of coding patterns.' },
    { title: 'Journal Entries', content: 'Review all of your logged coding problems.' },
    { title: 'Goals & Streaks', content: 'See your progress and maintain your streaks.' },
  ];

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedPatterns = localStorage.getItem('codingPatterns');
      if (storedPatterns) {
        setPatterns(JSON.parse(storedPatterns));
      }
      const storedJournal = localStorage.getItem('journalEntries');
      if (storedJournal) {
        setJournalEntries(JSON.parse(storedJournal));
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    }
  }, []);

  // Function to convert bullet points from a string into an HTML list
  const formatTextWithBullets = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const hasBullets = lines.some(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));

    if (hasBullets) {
        return (
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                {lines.map((line, index) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                        return <li key={index}>{trimmedLine.substring(2)}</li>;
                    }
                    // Handle non-bulleted lines within a bulleted section
                    if (trimmedLine) {
                        return <li key={index} style={{ listStyleType: 'none', paddingLeft: '0' }}>{trimmedLine}</li>;
                    }
                    return null;
                })}
            </ul>
        );
    } else {
        return (
            <div>
                {lines.map((line, index) => (
                    <p key={index} style={{marginBottom: '1rem'}}>{line}</p>
                ))}
            </div>
        );
    }
  };

  // Function to add a new pattern
  const handleAddPattern = (e) => {
    e.preventDefault();
    if (newPatternTitle && newPatternDescription && newPatternDifficulty) {
      const newPattern = {
        id: Date.now(),
        title: newPatternTitle,
        description: newPatternDescription,
        difficulty: newPatternDifficulty,
        // Save the new code field
        code: newPatternCode,
      };
      const updatedPatterns = [...patterns, newPattern];
      setPatterns(updatedPatterns);
      // Immediately save to localStorage after the state update
      localStorage.setItem('codingPatterns', JSON.stringify(updatedPatterns));
      
      setNewPatternTitle('');
      setNewPatternDescription('');
      setNewPatternDifficulty('');
      setNewPatternCode('');
      setIsAddingPattern(false);
    }
  };
  
  // Function to add a new problem to the journal
  const handleAddProblem = (e) => {
    e.preventDefault();
    if (newProblem.title && newProblem.difficulty) {
      const entryWithId = {
        ...newProblem,
        id: Date.now(),
        // Storing ISO string for easy date comparison later
        date: new Date().toISOString(), 
      };
      const updatedEntries = [...journalEntries, entryWithId];
      setJournalEntries(updatedEntries);
      // Immediately save to localStorage after the state update
      localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      
      setNewProblem({
        title: '',
        platform: '',
        difficulty: '',
        time: '',
        attempts: '',
        topic: '',
        rating: '',
        notes: '',
        code: ''
      });
      setActiveTab('Journal Entries'); // Automatically switch to the journal tab
    }
  };

  // Handler to delete a journal entry
  const handleDeleteJournalEntry = (id) => {
    const updatedEntries = journalEntries.filter(entry => entry.id !== id);
    setJournalEntries(updatedEntries);
    // Immediately save to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
  };

  // Handler to set up editing for a journal entry
  const handleEditJournalEntry = (entry) => {
    setEditingJournalData(entry);
    setIsEditingJournalEntry(true);
  };

  // Handler to update a journal entry
  const handleUpdateJournalEntry = (e) => {
    e.preventDefault();
    const updatedEntries = journalEntries.map(entry =>
      entry.id === editingJournalData.id ? editingJournalData : entry
    );
    setJournalEntries(updatedEntries);
    // Immediately save to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    
    setIsEditingJournalEntry(false);
    setEditingJournalData(null);
  };

  // Handler to delete a pattern
  const handleDeletePattern = (id) => {
    const updatedPatterns = patterns.filter(pattern => pattern.id !== id);
    setPatterns(updatedPatterns);
    // Immediately save to localStorage
    localStorage.setItem('codingPatterns', JSON.stringify(updatedPatterns));
  };

  // Handler to set up editing for a pattern
  const handleEditPattern = (pattern) => {
    setEditingPatternData(pattern);
    setIsEditingPattern(true);
  };
  
  // Handler to update a pattern
  const handleUpdatePattern = (e) => {
    e.preventDefault();
    const updatedPatterns = patterns.map(pattern =>
      pattern.id === editingPatternData.id ? editingPatternData : pattern
    );
    setPatterns(updatedPatterns);
    // Immediately save to localStorage
    localStorage.setItem('codingPatterns', JSON.stringify(updatedPatterns));
    
    setIsEditingPattern(false);
    setEditingPatternData(null);
  };
  
  // A simple function to render the content based on the active tab.
  const renderContent = () => {
    const tab = tabs.find(t => t.title === activeTab);
    if (!tab) return 'Content not found.';

    // Helper function to count difficulties
    const getCounts = (list) => {
      const easyCount = list.filter(item => item.difficulty === 'Easy').length;
      const mediumCount = list.filter(item => item.difficulty === 'Medium').length;
      const hardCount = list.filter(item => item.difficulty === 'Hard').length;
      return { easyCount, mediumCount, hardCount };
    };
    
    // Helper function to calculate streak and goals
    const calculateGoalsAndStreaks = () => {
      // Create a sorted list of unique dates from journal entries
      const uniqueDates = Array.from(new Set(journalEntries.map(entry => {
        const d = new Date(entry.date);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      }))).sort();

      let currentStreak = 0;
      let bestStreak = 0;
      let lastDate = null;
      
      uniqueDates.forEach(dateStr => {
        const currentDate = new Date(dateStr);
        if (lastDate === null || (currentDate - lastDate) / (1000 * 60 * 60 * 24) === 1) {
          currentStreak++;
        } else if ((currentDate - lastDate) / (1000 * 60 * 60 * 24) > 1) {
          bestStreak = Math.max(bestStreak, currentStreak);
          currentStreak = 1;
        }
        lastDate = currentDate;
      });
      bestStreak = Math.max(bestStreak, currentStreak);
      
      // Check if streak is active today
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
      
      const hasTodayEntry = uniqueDates.includes(todayStr);
      const hasYesterdayEntry = uniqueDates.includes(yesterdayStr);
      
      let finalStreak = 0;
      if (hasTodayEntry) {
        finalStreak = currentStreak;
      } else if (hasYesterdayEntry) {
        finalStreak = 0;
      } else {
        finalStreak = 0;
      }

      // Weekly and Monthly problem counts
      const now = new Date();
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);

      const weeklyProblems = journalEntries.filter(entry => new Date(entry.date) >= oneWeekAgo).length;
      const monthlyProblems = journalEntries.filter(entry => new Date(entry.date) >= oneMonthAgo).length;
      
      // Weekly activity grid
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyActivity = weekDays.map(day => ({ day, count: 0, isActive: false }));
      
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);

      journalEntries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= startOfWeek) {
          const dayIndex = entryDate.getDay();
          weeklyActivity[dayIndex].count++;
          weeklyActivity[dayIndex].isActive = true;
        }
      });
      
      return {
        currentStreak: finalStreak,
        bestStreak,
        weeklyProblems,
        monthlyProblems,
        weeklyActivity,
      };
    };
    

    if (tab.title === 'Problem Tracker') {
      return (
        <>
          <h3 className="content-title">
            {tab.icon} {tab.title}
          </h3>
          <p className="content-text">
            {tab.content}
          </p>
          <div className="content-tabs">
            <h4 className="form-title">Add New Problem</h4>
          </div>
          <form onSubmit={handleAddProblem} className="add-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Problem Title</label>
                <input
                  type="text"
                  placeholder="Two Sum, Binary Tree Inorder..."
                  value={newProblem.title}
                  onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Platform</label>
                <select
                  value={newProblem.platform}
                  onChange={(e) => setNewProblem({ ...newProblem, platform: e.target.value })}
                >
                  <option value="">Choose platform</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="HackerRank">Neetcode</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={newProblem.difficulty}
                  onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                  required
                >
                  <option value="">Level</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="form-group">
                <label>Time Spent (min)</label>
                <input
                  type="number"
                  value={newProblem.time}
                  onChange={(e) => setNewProblem({ ...newProblem, time: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Attempts</label>
                <input
                  type="number"
                  value={newProblem.attempts}
                  onChange={(e) => setNewProblem({ ...newProblem, attempts: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Pattern/Topic</label>
                <input
                  type="text"
                  placeholder="Array, Hash Map, Two Pointers..."
                  value={newProblem.topic}
                  onChange={(e) => setNewProblem({ ...newProblem, topic: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>My Rating</label>
                <select
                  value={newProblem.rating}
                  onChange={(e) => setNewProblem({ ...newProblem, rating: e.target.value })}
                >
                  <option value="">How did it go?</option>
                  <option value="⭐️">⭐️</option>
                  <option value="⭐️⭐️">⭐️⭐️</option>
                  <option value="⭐️⭐️⭐️">⭐️⭐️⭐️</option>
                  <option value="⭐️⭐️⭐️⭐️">⭐️⭐️⭐️⭐️</option>
                  <option value="⭐️⭐️⭐️⭐️⭐️">⭐️⭐️⭐️⭐️⭐️</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Code</label>
                <textarea
                  placeholder="Paste your code here..."
                  value={newProblem.code}
                  onChange={(e) => setNewProblem({ ...newProblem, code: e.target.value })}
                  rows="10"
                />
              </div>
              <div className="form-group full-width">
                <label>Notes & Reflections</label>
                <textarea
                  placeholder="What did I learn? What was tricky? What would I do differently next time? Use '- ' for bullet points."
                  value={newProblem.notes}
                  onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })}
                  rows="4"
                />
              </div>
            </div>
            <button type="submit" className="add-button">
              Add to Journal ✚
            </button>
          </form>
        </>
      );
    }
    
    if (tab.title === 'Coding Patterns') {
      const filteredPatterns = patternFilter === 'All'
        ? patterns
        : patterns.filter(p => p.difficulty === patternFilter);

      const patternCounts = getCounts(patterns);

      return (
        <>
          <h3 className="content-title">
            {tab.icon} {tab.title} Library
          </h3>
          <p className="content-text">
            {tab.content}
          </p>
          <div className="content-tabs">
            <button
              onClick={() => {setIsAddingPattern(false); setIsEditingPattern(false);}}
              className={`content-tab-button ${!isAddingPattern && !isEditingPattern ? 'active' : ''}`}
            >
              Pattern Library
            </button>
            <button
              onClick={() => {setIsAddingPattern(true); setIsEditingPattern(false);}}
              className={`content-tab-button ${isAddingPattern ? 'active' : ''}`}
            >
              Add Pattern
            </button>
          </div>
          <div className="filter-sort">
            <span className="filter-label">Filter by difficulty:</span>
            <button onClick={() => setPatternFilter('All')} className={`filter-button ${patternFilter === 'All' ? 'active' : ''}`}>All</button>
            <button onClick={() => setPatternFilter('Easy')} className={`filter-button easy ${patternFilter === 'Easy' ? 'active' : ''}`}>Easy</button>
            <button onClick={() => setPatternFilter('Medium')} className={`filter-button medium ${patternFilter === 'Medium' ? 'active' : ''}`}>Medium</button>
            <button onClick={() => setPatternFilter('Hard')} className={`filter-button hard ${patternFilter === 'Hard' ? 'active' : ''}`}>Hard</button>
          </div>

          {isAddingPattern ? (
            <form onSubmit={handleAddPattern} className="add-form">
              <h4 className="form-title">Add a New Pattern</h4>
              <input
                type="text"
                placeholder="Pattern Title"
                value={newPatternTitle}
                onChange={(e) => setNewPatternTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Pattern Description. Use '- ' for bullet points."
                value={newPatternDescription}
                onChange={(e) => setNewPatternDescription(e.target.value)}
                required
                rows="4"
              />
              <textarea
                placeholder="Paste your code here..."
                value={newPatternCode}
                onChange={(e) => setNewPatternCode(e.target.value)}
                rows="10"
              />
              <select
                value={newPatternDifficulty}
                onChange={(e) => setNewPatternDifficulty(e.target.value)}
                required
              >
                <option value="">Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <button type="submit" className="add-button">
                Add Pattern
              </button>
            </form>
          ) : isEditingPattern ? (
            <form onSubmit={handleUpdatePattern} className="add-form">
              <h4 className="form-title">Edit Pattern</h4>
              <input
                type="text"
                placeholder="Pattern Title"
                value={editingPatternData?.title || ''}
                onChange={(e) => setEditingPatternData({...editingPatternData, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Pattern Description"
                value={editingPatternData?.description || ''}
                onChange={(e) => setEditingPatternData({...editingPatternData, description: e.target.value})}
                required
                rows="4"
              />
              <textarea
                placeholder="Paste your code here..."
                value={editingPatternData?.code || ''}
                onChange={(e) => setEditingPatternData({...editingPatternData, code: e.target.value})}
                rows="10"
              />
              <select
                value={editingPatternData?.difficulty || ''}
                onChange={(e) => setEditingPatternData({...editingPatternData, difficulty: e.target.value})}
                required
              >
                <option value="">Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <button type="submit" className="add-button">
                Update Pattern
              </button>
              <button type="button" onClick={() => setIsEditingPattern(false)} className="add-button" style={{backgroundColor: '#e56d77'}}>
                Cancel
              </button>
            </form>
          ) : (
            <div className="patterns-list">
              <h4 className="patterns-title">Your Patterns</h4>
              {filteredPatterns.length === 0 ? (
                <p>No patterns found. Add a new one to get started!</p>
              ) : (
                filteredPatterns.map((pattern) => (
                  <div key={pattern.id} className="pattern-item">
                    <div className="journal-header">
                        <h5>{pattern.title}</h5>
                        <span className={`difficulty-badge ${pattern.difficulty?.toLowerCase()}`}>
                            {pattern.difficulty}
                        </span>
                    </div>
                    {/* Render with bullet points */}
                    <div className="formatted-text">{formatTextWithBullets(pattern.description)}</div>
                    {pattern.code && (
                        <div className="code-block">
                            <h6 className="code-title">Code:</h6>
                            <pre><code>{pattern.code}</code></pre>
                        </div>
                    )}
                    <div className="journal-actions">
                      <button onClick={() => handleEditPattern(pattern)} className="action-button edit-button">Edit</button>
                      <button onClick={() => handleDeletePattern(pattern.id)} className="action-button delete-button">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          <div className="difficulty-tracker">
            <div className="tracker-card easy">
              <span>{patternCounts.easyCount}</span> Easy
            </div>
            <div className="tracker-card medium">
              <span>{patternCounts.mediumCount}</span> Medium
            </div>
            <div className="tracker-card hard">
              <span>{patternCounts.hardCount}</span> Hard
            </div>
          </div>
        </>
      );
    }

    if (tab.title === 'Journal Entries') {
      const filteredEntries = journalFilter === 'All'
        ? journalEntries
        : journalEntries.filter(entry => entry.difficulty === journalFilter);
      
      const journalCounts = getCounts(journalEntries);

      return (
        <>
          <h3 className="content-title">
            {tab.icon} My Journey So Far
          </h3>
          <p className="content-text">
            Track your progress and reflect on your coding adventures 
          </p>
          <div className="filter-sort">
            <span className="filter-label">Filter by difficulty:</span>
            <button onClick={() => setJournalFilter('All')} className={`filter-button ${journalFilter === 'All' ? 'active' : ''}`}>All</button>
            <button onClick={() => setJournalFilter('Easy')} className={`filter-button easy ${journalFilter === 'Easy' ? 'active' : ''}`}>Easy</button>
            <button onClick={() => setJournalFilter('Medium')} className={`filter-button medium ${journalFilter === 'Medium' ? 'active' : ''}`}>Medium</button>
            <button onClick={() => setJournalFilter('Hard')} className={`filter-button hard ${journalFilter === 'Hard' ? 'active' : ''}`}>Hard</button>
          </div>
          {isEditingJournalEntry ? (
            <form onSubmit={handleUpdateJournalEntry} className="add-form">
              <h4 className="form-title">Edit Problem</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Problem Title</label>
                  <input
                    type="text"
                    placeholder="Two Sum, Binary Tree Inorder..."
                    value={editingJournalData?.title || ''}
                    onChange={(e) => setEditingJournalData({ ...editingJournalData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Platform</label>
                  <select
                    value={editingJournalData?.platform || ''}
                    onChange={(e) => setEditingJournalData({ ...editingJournalData, platform: e.target.value })}
                  >
                    <option value="">Choose platform</option>
                    <option value="LeetCode">LeetCode</option>
                    <option value="HackerRank">HackerRank</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={editingJournalData?.difficulty || ''}
                    onChange={(e) => setEditingJournalData({ ...editingJournalData, difficulty: e.target.value })}
                    required
                  >
                    <option value="">Level</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Time Spent (min)</label>
                  <input
                    type="number"
                    value={editingJournalData?.time || ''}
                    onChange={(e) => setEditingJournalData({ ...editingJournalData, time: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Attempts</label>
                  <input
                    type="number"
                    value={editingJournalData?.attempts || ''}
                    onChange={(e) => setEditingJournalData({ ...editingJournalData, attempts: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Pattern/Topic</label>
                  <input
                    type="text"
                    placeholder="Array, Hash Map, Two Pointers..."
                    value={editingJournalData?.topic || ''}
                    onChange={(e) => setEditingJournalData({ ...editingJournalData, topic: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>My Rating</label>
                  <select
                    value={editingJournalData?.rating || ''}
                    onChange={(e) => setEditingJournalData({ ...editingJournalData, rating: e.target.value })}
                  >
                    <option value="">How did it go?</option>
                    <option value="⭐️">⭐️</option>
                    <option value="⭐️⭐️">⭐️⭐️</option>
                    <option value="⭐️⭐️⭐️">⭐️⭐️⭐️</option>
                    <option value="⭐️⭐️⭐️⭐️">⭐️⭐️⭐️⭐️</option>
                    <option value="⭐️⭐️⭐️⭐️⭐️">⭐️⭐️⭐️⭐️⭐️</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Code & Reflections</label>
                  <textarea
                    placeholder="Paste your code here..."
                    value={editingJournalData?.code || ''}
                    onChange={(e) => setEditingJournalData({ ...editingJournalData, code: e.target.value })}
                    rows="10"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Notes & Reflections</label>
                  <textarea
                    placeholder="What did I learn? What was tricky? What would I do differently next time? Use '- ' for bullet points."
                    value={editingJournalData?.notes || ''}
                    onChange={(e) => setEditingJournalData({ ...editingJournalData, notes: e.target.value })}
                    rows="4"
                  />
                </div>
              </div>
              <button type="submit" className="add-button">
                Update Journal ✨
              </button>
              <button type="button" onClick={() => setIsEditingJournalEntry(false)} className="add-button" style={{backgroundColor: '#e56d77'}}>
                Cancel
              </button>
            </form>
          ) : (
            <div className="journal-list">
              {filteredEntries.length === 0 ? (
                <p>No journal entries yet. Add a new problem from the Problem Tracker!</p>
              ) : (
                filteredEntries.map((entry) => (
                  <div key={entry.id} className="journal-item">
                    <div className="journal-header">
                      <h5 className="journal-title">{entry.title}</h5>
                      <span className={`difficulty-badge ${entry.difficulty.toLowerCase()}`}>
                        {entry.difficulty}
                      </span>
                    </div>
                    <div className="journal-meta">
                      <span>{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span>{entry.platform}</span>
                      <span>{entry.time} min</span>
                      <span>{entry.attempts} attempts</span>
                      <span>{entry.topic}</span>
                      <span>{entry.rating}</span>
                    </div>
                    {/* Render with bullet points */}
                    <div className="formatted-text">{formatTextWithBullets(entry.notes)}</div>
                    {entry.code && (
                        <div className="code-block">
                            <h6 className="code-title">Code:</h6>
                            <pre><code>{entry.code}</code></pre>
                        </div>
                    )}
                    <div className="journal-actions">
                      <button onClick={() => handleEditJournalEntry(entry)} className="action-button edit-button">Edit</button>
                      <button onClick={() => handleDeleteJournalEntry(entry.id)} className="action-button delete-button">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          <div className="difficulty-tracker">
            <div className="tracker-card easy">
              <span>{journalCounts.easyCount}</span> Easy
            </div>
            <div className="tracker-card medium">
              <span>{journalCounts.mediumCount}</span> Medium
            </div>
            <div className="tracker-card hard">
              <span>{journalCounts.hardCount}</span> Hard
            </div>
          </div>
        </>
      );
    }
    
    if (tab.title === 'Goals & Streaks') {
      const { currentStreak, bestStreak, weeklyProblems, monthlyProblems, weeklyActivity } = calculateGoalsAndStreaks();

      return (
        <>
          <div className="goals-container">
            <div className="goal-card daily-streak-card">
              <h4 className="goal-card-title">Daily Streak</h4>
              <div className="streak-info">
                <span className="streak-count">{currentStreak}</span>
                <span className="streak-label">days</span>
              </div>
              <div className="streak-best">Best: {bestStreak} days</div>
            </div>
            
            <div className="goal-card weekly-activity-card">
              <h4 className="goal-card-title">This Week's Activity</h4>
              <div className="weekly-activity-grid">
                {weeklyActivity.map((day, index) => (
                  <div key={index} className="activity-day-box">
                    <span className="day-label">{day.day}</span>
                    <div className={`day-circle ${day.isActive ? 'active' : ''}`}>{day.count}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="goal-card my-goals-card">
              <h4 className="goal-card-title">My Goals</h4>
              <div className="goal-list">
                <div className="goal-item">
                  <div className="goal-header">
                    <span>Problems per week</span>
                    <span className="goal-progress-text">{weeklyProblems} / {weeklyGoal}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${Math.min(100, (weeklyProblems / weeklyGoal) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="goal-item">
                  <div className="goal-header">
                    <span>Weekly Goal</span>
                    <span className="goal-progress-text">{Math.floor((weeklyProblems / weeklyGoal) * 100)}% complete</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${Math.min(100, (weeklyProblems / weeklyGoal) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="goal-item">
                  <div className="goal-header">
                    <span>Monthly challenge</span>
                    <span className="goal-progress-text">{monthlyProblems} / {monthlyGoal}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${Math.min(100, (monthlyProblems / monthlyGoal) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="goal-item">
                  <div className="goal-header">
                    <span>Monthly Goal</span>
                    <span className="goal-progress-text">{Math.floor((monthlyProblems / monthlyGoal) * 100)}% complete</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${Math.min(100, (monthlyProblems / monthlyGoal) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Girl+Next+Door&display=swap');

          body {
            font-family: 'Girl Next Door', cursive, sans-serif;
            background-color: #fce7f3;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 2rem;
            margin: 0;
            color: #4b5563;
          }

          .app-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
          }

          .main-card {
            background-color: #fff;
            padding: 2rem;
            border-radius: 1.5rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            width: 100%;
          }

          .header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .main-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #d11231;
          }

          .subtitle {
            font-size: 1.25rem;
            color: #9ca3af;
          }

          .tabs-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border-radius: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            background-color: white;
            margin: 1rem 0;
          }

          .tab-button {
            display: flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            border-radius: 1.5rem;
            border: none;
            background-color: #f0f4f8;
            color: #6b7280;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
            box-shadow: none;
          }

          .tab-button.active {
            background-color: #ffb6c1;
            color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .tab-button span {
            margin-right: 0.5rem;
          }
          
          .content-card {
            background-color: #fef1f8;
            border-radius: 1rem;
            padding: 2rem;
            margin-top: 1rem;
            min-height: 400px;
          }
          
          .content-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #e56d77;
            margin-bottom: 0.5rem;
          }

          .content-text {
            font-size: 1rem;
            color: #6b7280;
            margin-bottom: 2rem;
          }

          .content-tabs {
            display: flex;
            justify-content: center;
            margin-bottom: 1rem;
            gap: 0.5rem;
          }

          .content-tab-button {
            padding: 0.75rem 1.5rem;
            border-radius: 1.5rem;
            border: none;
            background-color: #fde5f5;
            color: #6b7280;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
          }

          .content-tab-button.active {
            background-color: #ffb6c1;
            color: white;
          }

          .add-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
            background-color: #fde5f5;
            border-radius: 0.75rem;
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }
          
          .form-group.full-width {
            grid-column: span 2;
          }

          .form-group label {
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #d11231;
          }

          .form-title {
            font-weight: 600;
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
          }

          .add-form input,
          .add-form textarea,
          .add-form select {
            padding: 0.5rem;
            border-radius: 0.5rem;
            border: 1px solid #ddd;
            font-size: 1rem;
            width: 100%;
          }

          .add-button {
            padding: 0.75rem;
            border-radius: 0.75rem;
            background-color: #ffb6c1;
            color: white;
            font-weight: bold;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .add-button:hover {
            background-color: #e597a7;
          }
          
          .patterns-list, .problems-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .patterns-title, .problems-title {
            font-weight: 600;
            font-size: 1.25rem;
            margin-bottom: 1rem;
          }

          .pattern-item, .problem-item {
            background-color: #fde5f5;
            padding: 1rem;
            border-radius: 0.75rem;
            margin-bottom: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .pattern-item h5, .problem-item h5 {
            font-weight: 500;
            font-size: 1rem;
          }

          .pattern-item p, .problem-item p {
            font-size: 0.875rem;
            color: #666;
          }

          .filter-sort {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }

          .filter-label {
            font-weight: 600;
            color: #d11231;
          }

          .filter-button {
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            border: 1px solid #ddd;
            background-color: #fff;
            color: #666;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .filter-button.active {
            color: white;
            border-color: transparent;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .filter-button.easy.active { background-color: #66d9ef; }
          .filter-button.medium.active { background-color: #fd971f; }
          .filter-button.hard.active { background-color: #f92672; }
          .filter-button.all.active { background-color: #7e9281ff; }

          .difficulty-tracker {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-top: 2rem;
            text-align: center;
          }

          .tracker-card {
            background-color: #fde5f5;
            padding: 1rem;
            border-radius: 0.75rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .tracker-card span {
            font-size: 2rem;
            font-weight: 700;
            display: block;
          }

          .tracker-card.easy span { color: #66d9ef; }
          .tracker-card.medium span { color: #fd971f; }
          .tracker-card.hard span { color: #f92672; }
          .tracker-card.all span { color: #d1c2f0ff; }

          .journal-item {
            background-color: #fff;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            margin-bottom: 1rem;
          }

          .journal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }

          .journal-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #333;
            margin: 0;
          }

          .difficulty-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
            color: white;
          }
          
          .difficulty-badge.easy { background-color: #66d9ef; }
          .difficulty-badge.medium { background-color: #fd971f; }
          .difficulty-badge.hard { background-color: #f92672; }

          .journal-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            font-size: 0.875rem;
            color: #9ca3af;
            margin-bottom: 1rem;
          }
          
          .journal-meta span {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .journal-notes {
            font-style: italic;
            font-size: 0.9rem;
            color: #6b7280;
            border-left: 2px solid #ffb6c1;
            padding-left: 0.75rem;
          }
          
          .goals-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .goal-card {
            background-color: #fff;
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #fce7f3;
          }
          
          .goal-card-title {
            font-weight: 600;
            font-size: 1.25rem;
            color: #d11231;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
          }

          .daily-streak-card {
            border-color: #ffb6c1;
          }

          .daily-streak-card .streak-info {
            display: flex;
            align-items: baseline;
            gap: 0.5rem;
          }

          .daily-streak-card .streak-count {
            font-size: 3rem;
            font-weight: 700;
            color: #ffb6c1;
          }

          .daily-streak-card .streak-label {
            font-size: 1rem;
            color: #9ca3af;
          }
          
          .daily-streak-card .streak-best {
            font-size: 0.875rem;
            color: #6b7280;
          }

          .weekly-activity-card {
            border-color: #e56d77;
          }
          
          .weekly-activity-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0.5rem;
            text-align: center;
          }
          
          .activity-day-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .day-label {
            font-size: 0.875rem;
            color: #9ca3af;
          }
          
          .day-circle {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            color: white;
            background-color: #f0f4f8;
            color: #9ca3af;
            border: 2px solid #ddd;
          }
          
          .day-circle.active {
            background-color: #ffb6c1;
            color: white;
            border-color: #ffb6c1;
          }

          .my-goals-card {
            border-color: #d11231;
          }
          
          .goal-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .goal-item {
            display: flex;
            flex-direction: column;
          }
          
          .goal-header {
            display: flex;
            justify-content: space-between;
            font-weight: 600;
            font-size: 1rem;
            color: #d11231;
            margin-bottom: 0.5rem;
          }

          .goal-progress-text {
            color: #9ca3af;
          }
          
          .progress-bar-container {
            height: 0.5rem;
            background-color: #fde5f5;
            border-radius: 0.25rem;
          }
          
          .progress-bar {
            height: 100%;
            background-color: #ffb6c1;
            border-radius: 0.25rem;
            transition: width 0.3s ease;
          }

          .journal-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
          }

          .action-button {
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            border: none;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .edit-button {
            background-color: #66d9ef;
          }

          .edit-button:hover {
            background-color: #55c6e0;
          }

          .delete-button {
            background-color: #f92672;
          }

          .delete-button:hover {
            background-color: #e51f65;
          }
          
          .code-block {
            background-color: #f0f4f8;
            border-left: 3px solid #ffb6c1;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-top: 1rem;
            font-family: monospace;
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
          }

          .code-block pre {
            margin: 0;
            padding: 0;
          }

          .code-title {
            font-weight: 600;
            font-size: 0.9rem;
            color: #d11231;
            margin-bottom: 0.5rem;
          }
        `}
      </style>
      {/* The main container. */}
      <div className="app-container">
        {/* The card-like container for the tabs and content. */}
        <div className="main-card">
          {/* Header section with title and subtitle */}
          <div className="header">
            <h1 className="main-title">
              💗 My Coding Tracker 💗
            </h1>
            <p className="subtitle">
              Track my LeetCode , im locked in
            </p>
          </div>

          {/* Tab headers container. */}
          <div className="tabs-container">
            {tabs.map((tab) => (
              // Individual tab button.
              <button
                key={tab.title}
                onClick={() => setActiveTab(tab.title)}
                className={`tab-button ${activeTab === tab.title ? 'active' : ''}`}
              >
                <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab content area. */}
          <div className="content-card">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
