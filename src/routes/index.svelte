<script lang="ts">
  import miserablesData from '$lib/miserables.json'
  import ForceGraph from '$lib/force-graph.svelte'
</script>

<ForceGraph data={miserablesData} />
