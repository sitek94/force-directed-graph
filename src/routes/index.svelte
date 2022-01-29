<script lang="ts">
  import miserablesData from '$lib/miserables.json'
  import ForceGraph from '$lib/force-graph.svelte'

  const { nodes, links } = miserablesData

  let nodeRadius = 5

</script>

<ForceGraph
  {nodes} {links} {nodeRadius} />

<aside>
  <h1>D3 Force-Directed Graph</h1>
  <hr />
  <label>
    <input type='number' bind:value={nodeRadius}  />
    Node radius
  </label>
</aside>

<style>
  aside {
    position: fixed;
    top: 0;
    left: 0;
    padding: 1rem;
    height: 100vh;
    width: 300px;
  }
  h1 {
    margin-top: 0;
  }
</style>
