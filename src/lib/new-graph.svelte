<script lang='ts'>
  // Copyright 2021 Observable, Inc.
  // Released under the ISC license.
  // https://observablehq.com/@d3/disjoint-force-directed-graph

  import miserables from '$lib/miserables.json';

  import * as d3 from 'd3'
  import type { ForceLink, Line, SimulationNodeDatum } from 'd3'
  import { onMount } from 'svelte'

  interface Node extends SimulationNodeDatum {
    id: string
    group?: string
  }

  interface Link {
    source: string;
    target: string;
  }



  //
  // PROPS
  //
  let nodes: Node[] = miserables.nodes
  let links: Link[] = miserables.links

  //
  // OPTIONS
  //
  let nodeId: (n: Node) => string = d => d.id // given d in nodes, returns a unique identifier (string)
  let nodeGroup: (n: Node) => string // given d in nodes, returns an (ordinal) value for color
  let nodeGroups // an array of ordinal values representing the node groups
  let nodeTitle: (n: Node, i?: number) => string // given d in nodes, a title string
  let nodeFill = 'currentColor' // node stroke fill (if not using a group color encoding)
  let nodeStroke = '#fff' // node stroke color
  let nodeStrokeWidth = 1.5 // node stroke width, in pixels
  let nodeStrokeOpacity = 1 // node stroke opacity
  let nodeRadius = 5 // node radius, in pixels
  let nodeStrength
  let linkSource: (l: Link, i?: number) => string = ({ source }) => source // given d in links, returns a node identifier string
  let linkTarget: (l: Link, i?: number) => string = ({ target }) => target // given d in links, returns a node identifier string
  let linkStroke = '#999' // link stroke color
  let linkStrokeOpacity = 0.6 // link stroke opacity
  let linkStrokeWidth: ((l: Link) => number) | number = 1.5 // given d in links, returns a stroke width in pixels
  let linkStrokeLinecap = 'round' // link stroke linecap
  let linkStrength
  let colors = d3.schemeTableau10 // an array of color strings, for the node groups
  let width = 1000 // outer width, in pixels
  let height = 700 // outer height, in pixels
  let invalidation // when this promise resolves, stop the simulation

  //
  // COMPUTE VALUES
  //
  const nodesIds = nodes.map(nodeId) // .map(intern)
  const linksSources = links.map(linkSource) // .map(intern)
  const linksTargets = d3.map(links, linkTarget) // .map(intern)

  if (nodeTitle === undefined) nodeTitle = (_, i: number) => nodesIds[i]
  const nodesTitles = nodeTitle == null ? null : nodes.map(nodeTitle) // .map(intern)

  const nodesGroups = nodeGroup == null ? null : nodes.map(nodeGroup) // .map(intern)

  const strokeWidth = typeof linkStrokeWidth !== 'function' ? null : d3.map(links, linkStrokeWidth)

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = nodes.map((_, i) => ({ id: nodesIds[i] }))
  // $: links = links.map((_, i) => ({ source: linksSources[i], target: linksTargets[i] }))

  // Compute default domains.
  if (nodesGroups && nodeGroups === undefined) nodeGroups = d3.sort(nodesGroups)

  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors)

  // Construct the forces.
  const forceNode = d3.forceManyBody()
  // const forceLink = d3.forceLink<Node, Link>(links).id(({ index: i }) => nodesIds[i])
  if (nodeStrength !== undefined) forceNode.strength(nodeStrength)
  // if (linkStrength !== undefined) forceLink.strength(linkStrength)

  let svgEl
  onMount(() => {
    const svg = d3.select(svgEl)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')

    const simulation = d3
      .forceSimulation<Node>(nodes)
      // .force<Node, Link>('link', forceLink)
      .force<Node, Link>('charge', forceNode)
      .force<Node, Link>('x', d3.forceX())
      .force<Node, Link>('y', d3.forceY())
      .on<Node, Link>('tick', ticked) // TODO:

    const node = svg
      .append('g')
      .attr('fill', nodeFill)
      .attr('stroke', nodeStroke)
      .attr('stroke-opacity', nodeStrokeOpacity)
      .attr('stroke-width', nodeStrokeWidth)
      .selectAll<SVGCircleElement, Node>('circle')
      .data(nodes)
      .join('circle')
      .attr('r', nodeRadius)
    .call(drag(simulation)) // TODO:



    function ticked() {
      // link
      //   .attr('x1', d => d.source.x)
      //   .attr('y1', d => d.source.y)
      //   .attr('x2', d => d.target.x)
      //   .attr('y2', d => d.target.y)

      node.attr('cx', d => d.x).attr('cy', d => d.y)
    }
  })




  // const link = svg
  //   .append('g')
  //   .attr('stroke', linkStroke)
  //   .attr('stroke-opacity', linkStrokeOpacity)
  //   .attr('stroke-width', typeof linkStrokeWidth !== 'function' ? linkStrokeWidth : null)
  //   .attr('stroke-linecap', linkStrokeLinecap)
  //   .selectAll<SVGLineElement, Link>('line')
  //   .data(links)
  //   .join('line')

  // TODO: Not needed?
  // if (strokeWidth) link.attr('stroke-width', ({ index: i }) => strokeWidth[i])







  // if (nodesGroups) node.attr('fill', ({ index: i }) => color(nodesGroups[i]))
  // if (nodesTitles) node.append('title').text(({ index: i }) => nodesTitles[i])

  // Handle invalidation.
  if (invalidation != null) invalidation.then(() => simulation.stop())





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

<h1>Graph</h1>

<svg bind:this={svgEl} {width} {height}>

</svg>

<style>
  svg {

    background: #eee;
  }
</style>

