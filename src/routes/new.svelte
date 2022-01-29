<script>
  import Graph from '$lib/new-graph.svelte'
  import miserables from '$lib/miserables.json';

  const { nodes, links } = miserables;

  let innerWidth = 0
  let innerHeight = 0

</script>

<svelte:window bind:innerWidth bind:innerHeight />

<Graph {nodes} {links} width={innerWidth} height={innerHeight} />
