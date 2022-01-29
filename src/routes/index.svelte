<script>
  import Graph from '$lib/force-graph.svelte'
  import miserables from '../miserables.json'

  const { nodes, links } = miserables

  let innerWidth = 0
  let innerHeight = 0

  // Node
  let nodeRadius = 5
  let nodeFill = '#000'
  let nodeStroke = '#fff'
  let nodeStrokeWidth = 1.5
  let nodeStrokeOpacity = 1

  // Link
  let linkStroke = '#999'
  let linkStrokeOpacity = 0.6
  let linkStrokeWidth = 1.5

  $: options = {
    width: innerWidth,
    height: innerHeight,

    nodeRadius,
    nodeFill,
    nodeStroke,
    nodeStrokeWidth,
    nodeStrokeOpacity,

    linkStroke,
    linkStrokeOpacity,
    linkStrokeWidth,
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<Graph {nodes} {links} {...options} />

<aside>
  <h1>D3 Force-Directed Graph</h1>
  <hr />

  <h2>Node</h2>
  <label>
    <input type="number" bind:value={nodeRadius} />
    radius
  </label>
  <label>
    <input type="text" bind:value={nodeFill} maxlength={7} />
    fill
  </label>
  <label>
    <input type="text" bind:value={nodeStroke} maxlength={7} />
    stroke
  </label>
  <label>
    <input type="number" bind:value={nodeStrokeOpacity} step={0.05} min={0} max={1} />
    stroke opacity
  </label>
  <label>
    <input type="number" bind:value={nodeStrokeWidth} step={0.5} min={0} max={10} />
    stroke width
  </label>

  <h2>Link</h2>
  <label>
    <input type="text" bind:value={linkStroke} maxlength={7} />
    stroke
  </label>
  <label>
    <input type="number" bind:value={linkStrokeOpacity} step={0.05} min={0} max={1} />
    stroke opacity
  </label>
  <label>
    <input type="number" bind:value={linkStrokeWidth} step={0.5} min={0} max={10} />
    stroke width
  </label>
</aside>

<style>
  aside {
    position: fixed;
    top: 0;
    left: 0;
    padding: 16px;
    height: 100vh;
    width: 300px;
  }
  h1 {
    margin-top: 0;
  }
  input {
    width: 80px;
  }
  label {
    display: block;
    margin-bottom: 2px;
  }
</style>
