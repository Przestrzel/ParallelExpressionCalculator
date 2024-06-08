import React, { memo, useMemo } from 'react'
import { NodeDatum } from '../utils/types'
import Tree from '../utils/tree'
import { ResponsiveTreeCanvas } from '@nivo/tree'
import { Button, Card, CardBody, Flex, Heading, Text } from '@chakra-ui/react'
import ParallelExpressionCalc from '../utils/parallel-expression-calc'

interface Props {
  tree: Tree
}

const TreeVisualization = ({ tree }: Props) => {
  const data = useMemo(() => tree.getRoot()?.asNivoNode(), [tree])
  const algorithm = useMemo(() => {
    const leaves = tree.getLeaves();
    return new ParallelExpressionCalc(tree, leaves.slice(1, leaves.length - 1));
  }, [tree])

  if (!data) {
    throw new Error('Data is wrong formatted!')
  }

  const oddNodes = algorithm.getOddNodes();
  const evenNodes = algorithm.getEvenNodes();
  const rakeLeftNodes = ParallelExpressionCalc.getLeftSons(oddNodes);
  const rakeRightNodes = ParallelExpressionCalc.getRightSons(oddNodes);

  return (
    <div className="columns">
      <Flex width="100%" height="100%" flexGrow={1}>
        <ResponsiveTreeCanvas<NodeDatum>
          label={(node) => node.data['name']}
          data={data}
          nodeSize={24}
          fixNodeColorAtDepth={1}
          linkThickness={2}
          activeLinkThickness={4}
          inactiveLinkThickness={2}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          motionConfig="stiff"
          meshDetectionRadius={80}
          orientLabel={false}
        />
      </Flex>
      <Flex width="500px" height="100%" paddingY={8} flexDirection="column" gap={4} justifyContent="flex-start">
        <Heading size="lg">Algorithm data</Heading>
        <Card>
          <CardBody>
            <Text>A: {ParallelExpressionCalc.stringifyNodes(algorithm.getNodes())}</Text>
          </CardBody>
          <CardBody>
            <Text>A[odd]: {ParallelExpressionCalc.stringifyNodes(oddNodes)}</Text>
          </CardBody>
          <CardBody>
            <Text>A[even]: {ParallelExpressionCalc.stringifyNodes(evenNodes)}</Text>
          </CardBody>
        </Card>
        <Heading size="md">Rake</Heading>
        <Card>
          <CardBody>
            <Text>Rake [left]: {ParallelExpressionCalc.stringifyNodes(rakeLeftNodes)}</Text>
          </CardBody>
            <Button onClick={() => null}>Do</Button>
          <CardBody>
            <Text>Rake [right]: {ParallelExpressionCalc.stringifyNodes(rakeRightNodes)}</Text>
          </CardBody>
            <Button onClick={() => null}>Do</Button>
        </Card>
        <Heading size="md">Next iteration</Heading>
        <Card>
          <CardBody>
            <Text>A = {ParallelExpressionCalc.stringifyNodes(evenNodes)}</Text>
          </CardBody>
          <Button onClick={() => null}>Go</Button>
        </Card>
      </Flex>
    </div>
  )
}

export default memo(TreeVisualization)
