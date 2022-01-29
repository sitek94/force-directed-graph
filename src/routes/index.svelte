<script lang="ts">
  import miserablesData from '$lib/miserables.json'
  import ForceGraph from '$lib/force-graph.svelte'

  const { nodes, links } = miserablesData
</script>

<ForceGraph {nodes} {links} />

<h1>main</h1>
