import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { LpDialogComponent } from './lp-dialog/lp-dialog.component';
import { TrainingService } from './../../core';
import { ShowErrorService, DIALOG_ACTIONS } from './../../dialogs';
import { AdminAgGridMaterialCheckbox } from './../admin-ag-grid-checkbox';

import { GridOptions } from 'ag-grid/main';

@Component({
  selector: 'admin-learning-path',
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.scss']
})
export class LearningPathComponent implements OnInit {

    gridOptions: GridOptions = {};

    constructor(private dialog: MdDialog/*, private dialogRef: MdDialogRef<LpDialogComponent>*/,
                private trainingSrv: TrainingService, private showErrorSrv: ShowErrorService) {
        // Default options
        this.gridOptions.defaultColDef = { 
            width: 50,
            editable: true,
            filter: 'text'
        };
        
        // Configure grid
        this.gridOptions.rowHeight = 48;
        this.gridOptions.editType = 'fullRow';
        this.gridOptions.animateRows = true;
        this.gridOptions.enableFilter = true;
        this.gridOptions.enableSorting = true;
        this.gridOptions.enableColResize = true;
        //this.gridOptions.singleClickEdit = true;
        this.gridOptions.stopEditingWhenGridLosesFocus = true;
        this.gridOptions.sortingOrder = ['desc', 'asc', null];
        this.gridOptions.rowSelection = 'multiple';
        this.gridOptions.icons = {
            checkboxChecked: AdminAgGridMaterialCheckbox.CB_ICON
        };

        //
        this.gridOptions.onCellEditingStarted = (event) => {
            console.log('cellEditingStarted');
        };
        this.gridOptions.onCellEditingStopped = (event) => {
            console.log('cellEditingStopped', event);
        };

        this.gridOptions.columnDefs = [
            {
                headerName: '', 
                field: 'selectRow',
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                checkboxSelection: true,
                suppressFilter: true,
                width: 25
            },
            {
                headerName: 'Topic',
                field: 'topic',
                width: 80,
                filter: 'text'
            },
            {
                headerName: 'Name',
                field: 'name',
                width: 100,
                filter: 'text'
            },
            {
                headerName: 'Description',
                field: 'description',
                width: 200,
                filter: 'text'
            },
            {
                headerName: 'Enabled?',
                field: 'enabled',
                width: 65,
                cellRenderer: (params) => { return (params.value) ? 'Yes' : 'No' },
                cellEditor: 'select',
                cellEditorParams: {
                    values: ['Yes', 'No']
                },
                cellClass: 'center-column-content'
            },
            {
                headerName: '# Katas',
                field: 'katas',
                width: 60,
                filter: 'number',
                editable: false
            },
            {
                headerName: 'Updated',
                field: 'updatedAt',
                width: 100,
                filter: 'date',
                editable: false
            }
        ];
    }

    ngOnInit() {
        this.loadTrainingPaths();
    }

    loadTrainingPaths() {
        this.trainingSrv.getTrainingPathsForGrid().subscribe(
            (trainingPaths) => { 
                this.gridOptions.api.addItems(trainingPaths);
                this.gridOptions.api.sizeColumnsToFit();
            },
            (err) => { 
                this.showErrorSrv.showErrorInDialog(
                    'Ups! An error has occurred...',
                    'Sorry, an error has been occurred retrieving the training paths...', 
                    DIALOG_ACTIONS.NOP,
                    '');
            }
        );
    }

    addNewTrainingPath() {
        this.dialog.open(LpDialogComponent).afterClosed().subscribe((x) => {
            //console.log('Cerrado', x);
        });
    }

    startRowEditing() {
        
    }

    deleteTrainingPath() {
        let selectedRows = this.gridOptions.api.getSelectedRows();
        if(selectedRows.length === 0) {
            this.showErrorSrv.showErrorInDialog(
            'No rows selected',
            'Sorry, to delete a training path, you should select a row before...', 
            DIALOG_ACTIONS.NOP,
            'I got it!');
        } else {
            // Delete training paths
        }
    }

    openKatasOfTrainingPath() {
        
    }

}
