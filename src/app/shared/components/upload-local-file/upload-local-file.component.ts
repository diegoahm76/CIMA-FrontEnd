import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {FilePondOptions} from 'filepond';
import {FilePondComponent} from 'ngx-filepond/filepond.component';
import {NGXLogger} from 'ngx-logger';

const noop = () => {};

const CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UploadLocalFileComponent),
  multi: true,
};

interface MissingFilePondOptions {
  credits: boolean;
}

interface CustomFilePondOptions
  extends FilePondOptions,
    MissingFilePondOptions {}

@Component({
  selector: 'app-upload-local-file',
  templateUrl: './upload-local-file.component.html',
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class UploadLocalFileComponent implements OnInit, ControlValueAccessor {
  @ViewChild('myPond') myPond: FilePondComponent;

  @Input()
  acceptedFileTypes: string[];
  @Input()
  expectedTypes: string[];
  @Input()
  expectedTypesMap: {[mimetype: string]: string};
  @Output()
  fileAdded: EventEmitter<File>;

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  // The internal data model
  private innerValue: string;

  disabled: boolean;

  pondOptions: CustomFilePondOptions;
  pondFiles: FilePondOptions['files'];

  constructor(private translate: TranslateService, private logger: NGXLogger) {
    this.fileAdded = new EventEmitter<File>();

    this.innerValue = '';
    this.disabled = false;
  }

  ngOnInit() {
    this.initOptions();
  }

  private initOptions() {
    this.pondOptions = {
      name: 'file',
      allowMultiple: false,
      maxFiles: 1,
      className: 'my-filepond',
      credits: false,

      // Labels
      labelDecimalSeparator: '.',
      labelThousandsSeparator: ',',
      labelFileWaitingForSize: 'Calculando el tamaño del archivo',
      labelFileSizeNotAvailable: 'Tamaño del archivo no disponible',
      labelFileLoading: 'Cargando...',
      labelFileLoadError: 'Error durante la carga del archivo',
      labelIdle: 'Arrastre un archivo aquí o haga click para seleccionarlo',
      labelFileProcessing: 'Subiendo archivo...',
      labelFileProcessingComplete: 'Subida del archivo completa',
      labelFileProcessingAborted: 'Subida del archivo cancelada',
      labelFileProcessingError: 'Error durante la subida del archivo',
      labelTapToCancel: 'Click para cancelar',
      labelTapToRetry: 'Click para reintentar',
      labelTapToUndo: 'Click para quitar',
      labelButtonRemoveItem: 'Quitar',
      labelButtonAbortItemLoad: 'Abortar',
      labelButtonRetryItemLoad: 'Reintentar',
      labelButtonAbortItemProcessing: 'Cancelar',
      labelButtonUndoItemProcessing: 'Quitar',
      labelButtonRetryItemProcessing: 'Reintentar',
      labelButtonProcessItem: 'Subir archivo',

      // "File type validation" plugin
      acceptedFileTypes: this.acceptedFileTypes,
      labelFileTypeNotAllowed: 'Tipo de archivo inválido',
      fileValidateTypeLabelExpectedTypes: `Tipo de archivo esperado: ${this.expectedTypes.join(
        ', '
      )}`,
      fileValidateTypeLabelExpectedTypesMap: this.expectedTypesMap,

      // "File size validation" plugin
      maxFileSize: '100MB',
      labelMaxFileSizeExceeded: 'El archivo es muy grande',
      labelMaxFileSize: 'El máximo permitido por archivo es de 100 MB',
    };

    this.pondFiles = [];
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  // Get accessor
  get value(): string {
    return this.innerValue;
  }

  // Set accessor including call the onchange callback
  set value(value: string) {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.onChangeCallback(value);
    }
  }

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  pondHandleInit() {
    // this.logger.info('upload component has initialized', this.myPond);
  }

  pondHandleAddFile(event: any) {
    // this.logger.info('FilePond: A file was added (URL 222)', event);
    this.fileAdded.emit(event.file.file);
  }

  pondHandleActivateFile(event: any) {
    // this.logger.info('FilePond: A file was activated', event);
  }

  onFileStart(event: any) {
    // this.logger.info('FilePond: onFileStart', event);
    this.value = '';
  }

  onProcessFileStart(event: any) {
    // this.logger.info('FilePond: onProcessFileStart', event);
  }

  onProcessFile(event: any) {
    // this.logger.info('FilePond: onProcessFile', event);
    if (event.error) {
      // @TODO: manejar el error
    }
    this.value = event.file.id;
  }

  onPrepareFile(event: any) {
    // this.logger.info('FilePond: onPrepareFile', event);
  }

  onRemoveFile(event: any) {
    this.value = '';
  }
}
