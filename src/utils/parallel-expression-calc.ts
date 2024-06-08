import Tree from "./tree";
import TreeNode from "./tree-node";

class ParallelExpressionCalc {
  private tree: Tree;
  private nodes: TreeNode[];

  constructor(tree: Tree, nodes: TreeNode[]) {
    this.tree = tree;
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

  public getNodes = () => {
    return this.nodes;
  }

  public static stringifyNodes = (nodes: TreeNode[]) => {
    return nodes.map(node => node.toString()).join(', ');
  }

  public static getLeftSons = (nodes: TreeNode[]) => {
    return nodes.filter(node => node.getParent()?.getLeft() === node);
  }

  public static getRightSons = (nodes: TreeNode[]) => {
    return nodes.filter(node => node.getParent()?.getRight() === node);
  }

  public calculate = () => {
    const oddNodes = this.getOddNodes();
    const evenNodes = this.getEvenNodes();

    const firstStep = () => {
      oddNodes.forEach(node => {
        this.tree.rake(node);
      });
    }

    const secondStep = () => {
      evenNodes.forEach(node => {
        this.tree.rake(node);
      });
    }

    const finish = () => {
      this.nodes = evenNodes;
    }
  }
}

export default ParallelExpressionCalc;