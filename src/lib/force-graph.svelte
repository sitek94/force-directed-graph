<script lang="ts">
  import * as d3 from 'd3'
  import type { SimulationNodeDatum } from 'd3'

  interface Node extends SimulationNodeDatum {
    id: string
    group?: string
  }

  interface Link {
    source: string
    target: string
  }

  //
  // PROPS
  //

  export let nodes: Node[] = []
  export let links: Link[] = []
  export let width: number = 800
  export let height: number = 600

  //
  // OPTIONS
  //

  let nodeId: (n: Node) => string = d => d.id // given d in nodes, returns a unique identifier (string)
  let nodeGroup: (n: Node) => string = d => d.group // given d in nodes, returns an (ordinal) value for color
  let nodeGroups // an array of ordinal values representing the node groups
  let nodeTitle: (n: Node, i?: number) => string // given d in nodes, a title string
  export let nodeRadius = 5
  export let nodeFill = 'currentColor'
  export let nodeStroke = '#fff'
  export let nodeStrokeWidth = 1.5
  export let nodeStrokeOpacity = 1
  let nodeStrength
  let linkSource: (l: Link, i?: number) => string = ({ source }) => source // given d in links, returns a node identifier string
  let linkTarget: (l: Link, i?: number) => string = ({ target }) => target // given d in links, returns a node identifier string
  export let linkStroke = '#999'
  export let linkStrokeOpacity = 0.6
  export let linkStrokeWidth = 1.5
  let linkStrength
  let colors = d3.schemeTableau10 // an array of color strings, for the node groups

  //
  // COMPUTE VALUES
  //

  const nodesIds = nodes.map(nodeId)
  const linksSources = links.map(linkSource)
  const linksTargets = d3.map(links, linkTarget)

  if (nodeTitle === undefined) nodeTitle = (_, i: number) => nodesIds[i]
  const nodesTitles = nodeTitle == null ? null : nodes.map(nodeTitle)

  const nodesGroups = nodeGroup == null ? null : nodes.map(nodeGroup)

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = nodes.map((_, i) => ({ id: nodesIds[i] }))
  links = links.map((_, i) => ({ source: linksSources[i], target: linksTargets[i] }))

  // Compute default domains.
  if (nodesGroups && nodeGroups === undefined) nodeGroups = d3.sort(nodesGroups)

  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors)

  // Construct the forces.
  const forceNode = d3.forceManyBody()
  const forceLink = d3.forceLink<Node, Link>(links).id(({ index: i }) => nodesIds[i])
  if (nodeStrength !== undefined) forceNode.strength(nodeStrength)
  if (linkStrength !== undefined) forceLink.strength(linkStrength)

  let svgEl

  $: {
    if (svgEl) {
      const svg = d3.select(svgEl)

      const simulation = d3
        .forceSimulation<Node>(nodes)
        .force<Node, Link>('link', forceLink)
        .force<Node, Link>('charge', forceNode)
        .force<Node, Link>('x', d3.forceX())
        .force<Node, Link>('y', d3.forceY())
        .on<Node, Link>('tick', () => ticked(link, node))

      const link = svg.select('g').selectAll<SVGLineElement, Link>('line').data(links).join('line')

      const node = svg
        .select('g')
        .selectAll<SVGCircleElement, Node>('circle')
        .data(nodes)
        .join('circle')
        .call(drag(simulation))

      if (nodesTitles) node.append('title').text(({ index: i }) => nodesTitles[i])
    }
  }

  function ticked(link, node) {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    node.attr('cx', d => d.x).attr('cy', d => d.y)
  }

  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
  }
</script>

<svg bind:this={svgEl} {width} {height} viewBox={[-width / 2, -height / 2, width, height]}>
  <g>
    {#each links as link}
      <line
        stroke={linkStroke}
        stroke-opacity={linkStrokeOpacity}
        stroke-width={linkStrokeWidth}
        stroke-linecap="round"
      />
    {/each}
    {#each nodes as node, i}
      <circle
        r={nodeRadius}
        fill={nodeFill}
        stroke={nodeStroke}
        stroke-opacity={nodeStrokeOpacity}
        stroke-width={nodeStrokeWidth}
      />
    {/each}
  </g>
</svg>

<style>
  svg {
    max-width: 100%;
    height: auto;
  }
</style>
