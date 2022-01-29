<script lang="ts">
  import { ForceGraph } from '$lib/force-graph'

  export let nodes = []
  export let links = []
  export let nodeRadius

  let svg
  let width
  let height

  $: {
    if (svg) {
      const graph = ForceGraph(svg, { nodes, links}, {
        nodeId: d => d.id,
        nodeGroup: d => d.group || 'repo',
        nodeTitle: d => `${d.id} (${d.group})`,
        width,
        height,
        nodeRadius
      })
    }
  }
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<svg bind:this={svg}>
  <g>
    {#each links as link}
      <line stroke='#999' />
    {/each}
    {#each nodes as node}
      <circle r="10"  />
    {/each}
  </g>
</svg>
