<script lang="ts">
  import { onMount } from "svelte";  
  import { checkForAppUpdates } from "../lib/updater";
  onMount(async () => {

    // Disable right click context menu
    if (document) {
      document.addEventListener('contextmenu', e => e.preventDefault())
    }
    
    checkForAppUpdates(false)
  })
</script>

<slot />