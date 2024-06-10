import TreeNode from './tree-node'
import { Weight } from './types'

class ParallelExpressionCalc {
  private nodes: TreeNode[];

  constructor(nodes: TreeNode[]) {
    this.nodes = nodes;
  }

  public getOddNodes = () => {
    // Idx starts from 1
    return this.nodes.filter((_, idx) => (idx + 1) % 2 !== 0);
  }

  public getEvenNodes = () => {
    // Idx starts from 1
    return this.nodes.filter((_, idx) => (idx + 1) % 2 === 0);
  }

  public static stringifyNodes = (nodes: TreeNode[]) => {
    return nodes.map(node => node.toString()).join(', ');
  }

  public static getLeftSons = (nodes: TreeNode[]) => {
    return nodes.filter(node => node.isLeftSon());
  }

  public static getRightSons = (nodes: TreeNode[]) => {
    return nodes.filter(node => node.isRightSon());
  }

  private calculateAdditionWeights = (node: TreeNode): Weight => {
    const {a: Wa, b: Wb} = node.getBrother()!.getWeight();
    const {a: Ua, b: Ub} = node.getParent()!.getWeight();
    const {a: Va, b: Vb} = node.getWeight();
    const Vc = node.getValue() as number;

    return {a: Wa * Ua, b: Wb * Ua + Ua * (Va * Vc + Vb) + Ub};
  }

  private calculateMultiplicationWeights = (node: TreeNode): Weight => {
    const {a: Wa, b: Wb} = node.getBrother()!.getWeight();
    const {a: Ua, b: Ub} = node.getParent()!.getWeight();
    const {a: Va, b: Vb} = node.getWeight();
    const Vc = node.getValue() as number;


    return {a: Wa * Ua * (Va * Vc + Vb), b: Wb * Ua * (Va * Vc + Vb) + Ub};
  }

  private calculateWeight = (node: TreeNode): Weight => {
    const brother = node.getBrother();
    const parent = node.getParent();

    if(!brother) {
      throw new Error('Node has no brother. Wrong state');
    }
    if(!TreeNode.isOperator(parent?.getValue() as string)) {
      throw new Error('Parent is not an operator. Wrong state');
    }

    if(parent?.getValue() === '+') {
      return this.calculateAdditionWeights(node);
    }

    return this.calculateMultiplicationWeights(node);
  }

  private rake = (node: TreeNode) => {
    const brother = node.getBrother();
    const parent = node.getParent();
    const weight = this.calculateWeight(node);

    parent?.setNode(brother);
    parent?.setWeight(weight);
  }

  public rakeBatch = (nodes: TreeNode[]) => {
    return nodes.forEach(this.rake);
  }
}

export default ParallelExpressionCalc;