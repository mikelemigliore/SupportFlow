
async function handleDeleteAccountBtn({ user }: { user: string }) {
    try {

      const res = await fetch("/api/deleteAccount", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      return { success: true };
    } catch (err: any) {
      console.error("Delete user failed:", err);
      return {
        success: false,
        error: err?.message || "Unknown error",
      };
    }

}

export default handleDeleteAccountBtn;
