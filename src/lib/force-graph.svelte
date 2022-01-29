<script lang="ts">
  import { ForceGraph } from '$lib/force-graph'
  import { onMount } from 'svelte'

  export let data = { nodes: [], links: [] }

  let container

  onMount(() => {
    let width = window.innerWidth
    let height = window.innerHeight

    if (container) {
      // @ts-ignore
      const graph = ForceGraph(data, {
        nodeId: d => d.id,
        nodeGroup: d => d.group || 'repo',
        nodeTitle: d => `${d.id} (${d.group})`,
        width,
        height
      })
      container.appendChild(graph)
    }
  })

</script>

<div bind:this={container}></div>
