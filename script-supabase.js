// Cloud integration intentionally inactive until a new backend is configured.
// Never contact the retired project or report a local save as a cloud save.
const SupabaseModule = (() => {
  const unavailable = async () => { throw new Error('Cloud accounts are not configured yet.'); };
  return {
    init() {}, getClient: () => null, getUser: () => null, uid: () => null,
    getSession: async () => null, onAuthChange() {}, scheduleSyncUp() {},
    signInWithGoogle: unavailable, signOut: unavailable,
    syncAllUp: unavailable, syncAllDown: unavailable,
    migrateLocalData: unavailable, saveSessionNote: unavailable
  };
})();
