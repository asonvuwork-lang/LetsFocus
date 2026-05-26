// =============================================
// SUPABASE CLIENT + SYNC LAYER
// =============================================
const SupabaseModule = (function () {

  const SUPABASE_URL = 'https://ipntjmcqlottizmmhytr.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbnRqbWNxbG90dGl6bW1oeXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTQ4OTcsImV4cCI6MjA5NTAzMDg5N30.gM7M0b1hAt4kGw254f6aS36znssCX1quvlwkjMpfNQk';

  let client = null;
  let currentUser = null;
  let syncTimeout = null;

  // ---- Init client ----
  function initClient() {
    if (typeof window.supabase === 'undefined') {
      console.error('Supabase JS not loaded');
      return null;
    }
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    return client;
  }

  function getClient() { return client; }
  function getUser()   { return currentUser; }

  // ---- Auth ----
  async function signInWithGoogle() {
    if (!client) return;
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href,
        queryParams: { access_type: 'offline', prompt: 'consent' }
      }
    });
    if (error) console.error('Google sign in error:', error.message);
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
    currentUser = null;
    window.location.reload();
  }

  async function getSession() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    currentUser = data?.session?.user || null;
    return data?.session;
  }

  function onAuthChange(callback) {
    if (!client) return;
    client.auth.onAuthStateChange((event, session) => {
      currentUser = session?.user || null;
      callback(event, session);
    });
  }

  // ---- Helpers ----
  function uid() { return currentUser?.id; }

  async function upsert(table, data) {
    if (!client || !uid()) return null;
    const { data: result, error } = await client
      .from(table)
      .upsert({ ...data, user_id: uid() }, { onConflict: 'user_id' });
    if (error) console.error(`Upsert ${table} error:`, error.message);
    return result;
  }

  async function fetchOne(table) {
    if (!client || !uid()) return null;
    const { data, error } = await client
      .from(table)
      .select('*')
      .eq('user_id', uid())
      .single();
    if (error && error.code !== 'PGRST116') console.error(`Fetch ${table} error:`, error.message);
    return data;
  }

  // ---- GOALS ----
  async function syncGoalsUp(goals) {
    if (!client || !uid()) return;
    // Delete all existing, then insert fresh (simple approach)
    await client.from('goals').delete().eq('user_id', uid());
    if (!goals.length) return;
    const rows = goals.map((g, i) => ({
      user_id: uid(),
      text: g.text,
      category: g.category || null,
      completed: g.completed || false,
      deadline: g.deadline || null,
      recurring: g.recurring || null,
      subgoals: g.subgoals || [],
      sort_order: i,
      local_id: String(g.id),
    }));
    const { error } = await client.from('goals').insert(rows);
    if (error) console.error('Goals sync error:', error.message);
  }

  async function fetchGoals() {
    if (!client || !uid()) return null;
    const { data, error } = await client
      .from('goals')
      .select('*')
      .eq('user_id', uid())
      .order('sort_order');
    if (error) { console.error('Fetch goals error:', error.message); return null; }
    return data.map(g => ({
      id: g.local_id || g.id,
      text: g.text,
      category: g.category,
      completed: g.completed,
      deadline: g.deadline,
      recurring: g.recurring,
      subgoals: g.subgoals || [],
    }));
  }

  // ---- CATEGORIES ----
  async function syncCategoriesUp(categories) {
    if (!client || !uid()) return;
    await client.from('categories').delete().eq('user_id', uid());
    if (!categories.length) return;
    const rows = categories.map(c => ({
      user_id: uid(),
      name: c.name, color: c.color, drink: c.drink, local_id: c.id,
    }));
    const { error } = await client.from('categories').insert(rows);
    if (error) console.error('Categories sync error:', error.message);
  }

  async function fetchCategories() {
    if (!client || !uid()) return null;
    const { data, error } = await client
      .from('categories').select('*').eq('user_id', uid());
    if (error) { console.error('Fetch categories error:', error.message); return null; }
    return data.map(c => ({ id: c.local_id || c.id, name: c.name, color: c.color, drink: c.drink }));
  }

  // ---- STATS ----
  async function syncStatsUp(stats) {
    if (!client || !uid()) return;
    const { error } = await client.from('stats').upsert({
      user_id: uid(),
      total_seconds: stats.totalSeconds || 0,
      sessions_completed: stats.sessionsCompleted || 0,
      goals_completed: stats.goalsCompleted || 0,
      streak: stats.streak || 0,
      last_session_date: stats.lastSessionDate || null,
      daily: stats.daily || {},
      best_session: stats.bestSession || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (error) console.error('Stats sync error:', error.message);
  }

  async function fetchStats() {
    const data = await fetchOne('stats');
    if (!data) return null;
    return {
      totalSeconds: data.total_seconds,
      sessionsCompleted: data.sessions_completed,
      goalsCompleted: data.goals_completed,
      streak: data.streak,
      lastSessionDate: data.last_session_date,
      daily: data.daily || {},
      bestSession: data.best_session,
    };
  }

  // ---- XP ----
  async function syncXPUp(xp) {
    if (!client || !uid()) return;
    const { error } = await client.from('xp').upsert({
      user_id: uid(),
      total_xp: xp.totalXP || 0,
      unlocked_achievements: xp.unlockedAchievements || [],
      xp_log: (xp.xpLog || []).slice(0, 100),
      overdue_streak: xp.overdueStreak || 0,
      pomo_cycles: xp.pomoCycles || 0,
      total_focus_seconds: xp.totalFocusSeconds || 0,
      goals_completed: xp.goalsCompleted || 0,
      on_time_goals: xp.onTimeGoals || 0,
      data: xp,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (error) console.error('XP sync error:', error.message);
  }

  async function fetchXP() {
    const row = await fetchOne('xp');
    if (!row) return null;
    // Return full data object which contains all XP fields
    return row.data || {
      totalXP: row.total_xp,
      unlockedAchievements: row.unlocked_achievements || [],
      xpLog: row.xp_log || [],
      overdueStreak: row.overdue_streak || 0,
      pomoCycles: row.pomo_cycles || 0,
      totalFocusSeconds: row.total_focus_seconds || 0,
      goalsCompleted: row.goals_completed || 0,
      onTimeGoals: row.on_time_goals || 0,
    };
  }

  // ---- BILL POSITIONS ----
  async function syncPositionsUp(positions) {
    if (!client || !uid()) return;
    const { error } = await client.from('bill_positions').upsert({
      user_id: uid(), positions, updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (error) console.error('Positions sync error:', error.message);
  }

  async function fetchPositions() {
    const data = await fetchOne('bill_positions');
    return data?.positions || {};
  }

  // ---- SESSION NOTES ----
  async function saveSessionNote(text) {
    if (!client || !uid()) return;
    const { error } = await client.from('session_notes')
      .insert({ user_id: uid(), text });
    if (error) console.error('Session note error:', error.message);
  }

  // ---- FULL SYNC ----
  // Debounced — batches rapid changes into one sync call
  function scheduleSyncUp() {
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(syncAllUp, 1500);
  }

  async function syncAllUp() {
    if (!uid()) return;
    try {
      const goals      = JSON.parse(localStorage.getItem('goals') || '[]');
      const categories = JSON.parse(localStorage.getItem('letsfocus_categories_v2') || '[]');
      const stats      = JSON.parse(localStorage.getItem('letsfocus_stats') || '{}');
      const xp         = JSON.parse(localStorage.getItem('letsfocus_xp') || '{}');
      const positions  = JSON.parse(localStorage.getItem('letsfocus_bill_positions') || '{}');
      await Promise.all([
        syncGoalsUp(goals),
        syncCategoriesUp(categories),
        syncStatsUp(stats),
        syncXPUp(xp),
        syncPositionsUp(positions),
      ]);
    } catch(e) { console.error('Sync error:', e); }
  }

  // Pull everything from Supabase and write to localStorage
  async function syncAllDown() {
    if (!uid()) return;
    try {
      const [goals, categories, stats, xp, positions] = await Promise.all([
        fetchGoals(), fetchCategories(), fetchStats(), fetchXP(), fetchPositions(),
      ]);
      if (goals      !== null) localStorage.setItem('goals', JSON.stringify(goals));
      if (categories !== null) localStorage.setItem('letsfocus_categories_v2', JSON.stringify(categories));
      if (stats      !== null) localStorage.setItem('letsfocus_stats', JSON.stringify(stats));
      if (xp         !== null) localStorage.setItem('letsfocus_xp', JSON.stringify(xp));
      if (positions  !== null) localStorage.setItem('letsfocus_bill_positions', JSON.stringify(positions));
    } catch(e) { console.error('Sync down error:', e); }
  }

  // ---- MIGRATION: localStorage → Supabase on first login ----
  async function migrateLocalData() {
    if (!uid()) return;
    // Check if user already has data in Supabase
    const existing = await fetchOne('stats');
    if (existing) return; // Already has cloud data — don't overwrite

    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    if (!goals.length) return; // Nothing to migrate

    showCustomAlert('☕ Syncing your local data to the cloud…');
    await syncAllUp();
    showCustomAlert('✅ Your data has been saved to your account!');
  }

  function init() { initClient(); }

  return {
    init, getClient, getUser, signInWithGoogle, signOut,
    getSession, onAuthChange, scheduleSyncUp, syncAllDown,
    syncAllUp, migrateLocalData, saveSessionNote, uid,
  };
})();
