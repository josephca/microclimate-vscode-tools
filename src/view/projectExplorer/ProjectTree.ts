
import { TreeItem, TreeDataProvider, Event, EventEmitter, TreeItemCollapsibleState } from 'vscode';

import { TreeItemAdaptable, SimpleTreeItem } from './TreeItemAdaptable';
import ConnectionManager from '../../microclimate/connections/ConnectionManager';

class ProjectTreeDataProvider implements TreeDataProvider<TreeItemAdaptable> {

    public readonly treeDataProvider: TreeDataProvider<{}> = this;
    public readonly viewId: string = "ext.mc.projectExplorer";        // must match package.json

    private onChangeEmitter: EventEmitter<TreeItemAdaptable> = new EventEmitter<TreeItemAdaptable>();
    readonly onDidChangeTreeData: Event<TreeItemAdaptable> = this.onChangeEmitter.event;

    private readonly root: TreeItemAdaptable;

    constructor() {
        ConnectionManager.instance.addOnChangeListener(this.refresh);
        this.root = new SimpleTreeItem("Microclimate", TreeItemCollapsibleState.Expanded, ConnectionManager.instance.connections);
    }

    // "instance arrow function" here ensures proper 'this' binding when used as a callback
    // "https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript"
    public refresh = (): void => {
        console.log("Refresh tree");
        this.onChangeEmitter.fire();
    }

    getTreeItem(node: TreeItemAdaptable): TreeItem | Promise<TreeItem> {
        return node.toTreeItem();
    }

    getChildren(node?: TreeItemAdaptable): TreeItemAdaptable[] | Promise<TreeItemAdaptable[]> {
        if (!node) {
            return [ this.root ];
        }

        return node.getChildren();
    }
}

export {
    ProjectTreeDataProvider
};