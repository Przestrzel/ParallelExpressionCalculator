import React, { memo, useEffect } from 'react'
import { NodeDatum } from '../utils/types'
import Tree from '../utils/tree'
import { ResponsiveTreeCanvas } from '@nivo/tree'
import { Button, Card, CardBody, Flex, Heading, Text } from '@chakra-ui/react'
import ParallelExpressionCalc from '../utils/parallel-expression-calc'
import TreeNode from '../utils/tree-node'

interface Props {
  tree: Tree;
  setTree: React.Dispatch<React.SetStateAction<Tree | undefined>>;
}

enum AlgorithmStep {
  RakeLeft = 'RakeLeft',
  RakeRight = 'RakeRight',
  NextIteration = 'NextIteration',
}

const TreeVisualization = ({ tree, setTree }: Props) => {
  const [step, setStep] = React.useState<AlgorithmStep>(AlgorithmStep.RakeLeft);
  const [ended, setEnded] = React.useState<boolean>(false);
  const [iteration, setIteration] = React.useState<number>(1);
  const [leaves, setLeaves] = React.useState<TreeNode[]>(tree.getLeavesWithoutExtremes());
  const data = tree.getRoot()?.asNivoNode();
  const algorithm = new ParallelExpressionCalc(leaves);

  if (!data) {
    throw new Error('Data is wrong formatted!')
  }

  const oddNodes = algorithm.getOddNodes();
  const evenNodes = algorithm.getEvenNodes();
  const rakeLeftNodes = ParallelExpressionCalc.getLeftSons(oddNodes);
  const rakeRightNodes = ParallelExpressionCalc.getRightSons(oddNodes);
  const rakeLeftDisabled = step !== AlgorithmStep.RakeLeft || ended;
  const rakeRightDisabled = step !== AlgorithmStep.RakeRight || ended;
  const nextIterationDisabled = step !== AlgorithmStep.NextIteration || ended;

  useEffect(() => {
    if(!rakeLeftNodes.length) {
      setStep(AlgorithmStep.RakeRight);
      if(!rakeRightNodes.length) {
        setStep(AlgorithmStep.NextIteration);
      }
      if(!leaves.length) {
        return setEnded(true);
      }
    }
  }, [leaves, rakeLeftNodes.length, rakeRightNodes.length])

  const rake = (nodes: TreeNode[], step: AlgorithmStep, disabled: boolean) => {
    if(disabled){
      return;
    }

    algorithm.rakeBatch(nodes);
    setTree(tree);
    setStep(step === AlgorithmStep.RakeLeft ? AlgorithmStep.RakeRight : AlgorithmStep.NextIteration);
  }

  const goToNextIteration = () => {
    if(nextIterationDisabled) {
      return;
    }
    const evenTreeNodes = tree.getLeaves().filter(
      (node) => evenNodes.find((evenNode) => evenNode.equals(node))
    );
    setLeaves(evenTreeNodes);
    setStep(AlgorithmStep.RakeLeft);
    setIteration(prev => prev + 1);
  }

  const getEndedResultCalc = (): string => {
    const root = tree.getRoot()!;
    const left = root.getLeft()!;
    const right = root.getRight()!;
    const result = root.operator() !== null ?
      root.operator()!(left.calculate(), right.calculate()) : 0;
    return `(${left.toCalcString()}) ${root.getValue()} (${right.toCalcString()}) = ${result}`
  }

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
            <Text>Iteration: {iteration}</Text>
          </CardBody>
          <CardBody>
            <Text>A: {ParallelExpressionCalc.stringifyNodes(leaves)}</Text>
          </CardBody>
          <CardBody>
            <Text>A[odd]: {ParallelExpressionCalc.stringifyNodes(oddNodes)}</Text>
          </CardBody>
          <CardBody>
            <Text>A[even]: {ParallelExpressionCalc.stringifyNodes(evenNodes)}</Text>
          </CardBody>
          {ended ?
            <CardBody>
              <Text color="red">Algorithm ended</Text>
              <Text color="green">{getEndedResultCalc()}</Text>
            </CardBody> : null
          }
        </Card>
        <Heading size="md">Rake</Heading>
        <Card>
          <CardBody>
            <Text>Rake [left]: {ParallelExpressionCalc.stringifyNodes(rakeLeftNodes)}</Text>
          </CardBody>
            <Button
              border='2px'
              borderColor={rakeLeftDisabled ? 'gray.200' : 'green.500'}
              onClick={() => rake(rakeLeftNodes, AlgorithmStep.RakeLeft, rakeLeftDisabled)}
            >
              Do
            </Button>
          <CardBody>
            <Text>Rake [right]: {ParallelExpressionCalc.stringifyNodes(rakeRightNodes)}</Text>
          </CardBody>
            <Button
              border='2px'
              borderColor={rakeRightDisabled ? 'gray.200' : 'green.500'}
              onClick={() => rake(rakeRightNodes, AlgorithmStep.RakeRight, rakeRightDisabled)}
            >
              Do
            </Button>
        </Card>
        <Heading size="md">Next iteration</Heading>
        <Card>
          <CardBody>
            <Text>A = {ParallelExpressionCalc.stringifyNodes(evenNodes)}</Text>
          </CardBody>
          <Button
            border='2px'
            borderColor={nextIterationDisabled ? 'gray.200' : 'green.500'}
            onClick={goToNextIteration}
          >Go</Button>
        </Card>
      </Flex>
    </div>
  )
}

export default memo(TreeVisualization)
