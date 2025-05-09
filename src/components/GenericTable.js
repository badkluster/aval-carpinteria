// Dentro de GenericList.js

import React, { useState } from "react";
import MaterialTable, { MTableToolbar } from "@material-table/core";
import { Button } from "antd";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { esES } from "@mui/material/locale";
import {
  PlusOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  FileDoneOutlined,
  WhatsAppOutlined,
  PhoneOutlined,
  CloseCircleOutlined,
  LinkOutlined,
  EyeOutlined,
  CopyOutlined,
  DollarCircleOutlined,
  WarningOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import MaterialTableLocalization from "../localization/materialTable.localization";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import "./GenericTable.css";

export default function GenericTable(props) {
  const {
    columns,
    data,
    actions,
    itemsToShow,
    title,
    onEditAction,
    onCreateButtonClick,
    onDeleteAction,
    onCancelAction,
    onDownloadAction,
    addDisabled,
    onDesvinculateAction,
    onVinculateAction,
    onViewPerfil,
    onSendByEmail,
    onViewDetail,
    onPaymentAction,
    detailPanel,
    onClone,
    selection,
    handleRowSelection,
    onAddNewness,
    onGenerateRavAction,
    hideSearch,
    hideFilter,
    COLORS,
    onPageSizeChange,
    onPageChange,
    onOrderChange,
  } = props;

  const theme = createTheme(
    {
      typography: {
        fontSize: 12, // Ajusta el tamaño base de la fuente
      },
      components: {
        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: "4px 8px", // Ajusta el relleno (padding) de las celdas
            },
            head: {
              fontSize: "0.95rem", // Tamaño de fuente de las celdas del encabezado
              fontWeight: "bold",
            },
            body: {
              fontSize: "1rem !important", // Tamaño de fuente de las celdas del cuerpo
            },
          },
        },
      },
      palette: {
        primary: { main: "#1976d2" },
      },
    },
    esES
  );

  const [filtering, setFiltering] = useState(false);

  const selectedRow = React.useRef([]);

  const handleClick = (rows) => {
    selectedRow.current = rows;

    handleRowSelection(selectedRow.current);
  };

  const actionsList = {
    edit: {
      icon: EditOutlined,
      tooltip: "Editar",
      onClick: (event, rowData) => onEditAction(rowData),
    },
    clonar: {
      icon: CopyOutlined,
      tooltip: "Clonar",
      onClick: (event, rowData) => onClone(rowData),
    },
    email: {
      icon: MailOutlined,
      tooltip: "Email",
      onClick: (event, rowData) => sendEmailAction(rowData.email || ""),
    },
    whatsApp: {
      icon: WhatsAppOutlined,
      tooltip: "Contactar por WhatsApp",
      onClick: (event, rowData) =>
        sendWhatsappAction(rowData?.codeAreaCell + rowData.cellPhone || ""),
    },
    phoneCall: {
      icon: PhoneOutlined,
      tooltip: "Contactar por teléfono",
      onClick: (event, rowData) =>
        callByPhoneAction(rowData?.codeAreaPhone + rowData.phone || ""),
    },
    newTask: {
      icon: FileDoneOutlined,
      tooltip: "Crear tarea",
    },
    delete: {
      icon: DeleteOutlined,
      tooltip: "Eliminar",
      onClick: (event, rowData) => onDeleteAction(rowData),
    },
    cancel: {
      icon: CloseCircleOutlined,
      tooltip: "Cancelar",
      onClick: (event, rowData) => onCancelAction(rowData),
    },
    download: {
      icon: CloudDownloadOutlined,
      tooltip: "Descargar",
      onClick: (event, rowData) => onDownloadAction(rowData),
    },
    desvinculate: {
      icon: LinkOffIcon,
      tooltip: "Desvincular",
      onClick: (event, rowData) => onDesvinculateAction(rowData),
    },
    viewProfile: {
      icon: EyeOutlined,
      tooltip: "Ver perfil",
      onClick: (event, rowData) => onViewPerfil(rowData),
    },
    vinculate: {
      icon: LinkOutlined,
      tooltip: "Vincular",
      onClick: (event, rowData) => onVinculateAction(rowData),
    },
    sendByEmail: {
      icon: ForwardToInboxIcon,
      tooltip: "Enviar por email",
      onClick: (event, rowData) => onSendByEmail(rowData),
    },
    viewDetail: {
      icon: EyeOutlined,
      tooltip: "Ver detalle",
      onClick: (event, rowData) => onViewDetail(rowData),
    },
    payment: {
      icon: DollarCircleOutlined,
      tooltip: "Cobranza",
      onClick: (event, rowData) => onPaymentAction(rowData),
    },
    generateRav: {
      icon: FileDoneOutlined,
      tooltip: "Generar RAV",
      onClick: (event, rowData) => onGenerateRavAction(rowData),
    },
    addNewness: {
      icon: WarningOutlined,
      tooltip: "Agregar novedad",
      onClick: (event, rowData) => onAddNewness(rowData),
    },
  };

  const actionsSelected = actions.map((action) => {
    return actionsList[action];
  });

  function sendWhatsappAction(cellPhone) {
    if (cellPhone) {
      window.open(`https://wa.me/${cellPhone.replace(/[\s-]/g, "")}`);
    }
  }

  function sendEmailAction(email) {
    const mailto = `mailto:${email}`;
    window.open(mailto);
  }

  function callByPhoneAction(phoneNumber) {
    const call = `tel:${phoneNumber}`;
    window.open(call);
  }

  return (
    <>
      <div className="listContainer">
        <ThemeProvider theme={theme}>
          <MaterialTable
            localization={MaterialTableLocalization}
            columns={columns}
            className="genericTable"
            data={data}
            title={title}
            components={{
              Toolbar: (props) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginRight: "8px",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <MTableToolbar {...props} />
                  </div>
                  {!hideFilter && (
                    <Button
                      onClick={() => {
                        setFiltering((currentFilter) => !currentFilter);
                      }}
                    >
                      <FilterOutlined />
                    </Button>
                  )}
                  {!addDisabled && (
                    <Button
                      type="primary"
                      onClick={() => {
                        onCreateButtonClick();
                      }}
                      style={{
                        marginLeft: "6px",
                        backgroundColor: COLORS ? COLORS.SECONDARY : "#00909E",
                        color: "#fff",
                      }}
                    >
                      <PlusOutlined />
                    </Button>
                  )}
                </div>
              ),
            }}
            detailPanel={
              !detailPanel
                ? null
                : [
                    {
                      render: (rowData) => (
                        <span>{detailPanel(rowData.rowData)}</span>
                      ),
                    },
                  ]
            }
            actions={actionsSelected}
            options={{
              actionsColumnIndex: -1,
              pageSize: itemsToShow || 10,
              filtering: filtering,
              search: !hideSearch,
              exportMenu: [
                {
                  label: "Exportar PDF",
                  exportFunc: (cols, datas) =>
                    ExportPdf(cols, datas, "reporte"),
                },
                {
                  label: "Exportar CSV",
                  exportFunc: (cols, datas) =>
                    ExportCsv(cols, datas, "reporte"),
                },
              ],
              selection: selection || false,
              padding: "dense",
              rowStyle: {
                height: 32,
              },
              headerStyle: {
                padding: "4px 8px",
                textAlign: "center",
              },
            }}
            onSelectionChange={(rows) => {
              handleClick(rows);
            }}
            onPageChange={(page) => onPageChange(page)}
            onRowsPerPageChange={(pageSize) => onPageSizeChange(pageSize)}
            onOrderCollectionChange={onOrderChange}
          />
        </ThemeProvider>
      </div>
    </>
  );
}
