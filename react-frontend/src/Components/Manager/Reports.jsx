import {Table, TableBody, TableContainer, TableFooter, TableHead, TablePagination, TableRow} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React, {useEffect, useMemo, useState} from "react";
import {useApi, useDateParser} from "../../Services/Hooks";
import useStyles from "../Utils/Style/useStyles";

const reports = [
    "Étudiants inscrits",
    "Étudiants sans CV",
    "Étudiants avec CV en attente d'approbation",
    "Étudiants sans stage",
    "Étudiants ayant une entrevue prévue",
    <Divider/>,
    "Offres de stage",
    "Offres de stage en attente d'approbation",
    "Offres de stage non comblées",
    <Divider/>,
    "Contrats en attente de signature par l'étudiant",
    "Contrats en attente de signature par l'employeur",
    "Contrats en attente de signature par l'administration"
]
const reportEndpoints = [
    "students",
    "studentsWithoutResume",
    "studentsPendingResumes",
    "studentsNotHired",
    "studentsScheduledInterview",
    undefined,
    "offers",
    "offersPendingApprobation",
    "offersWithoutHired",
    undefined,
    "contractsWaitingStudent",
    "contractsWaitingEmployer",
    "contractsWaitingAdmin"
]

function DataTableHeader({report}) {
    let header = undefined
    if (reportEndpoints[report].includes("student")) {
        header = <TableRow>
            <TableCell>Matricule</TableCell>
            <TableCell>Prénom</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Adresse courriel</TableCell>
            <TableCell>Numéro de téléphone</TableCell>
        </TableRow>
    } else if (reportEndpoints[report].includes("offers")) {
        header = <TableRow>
            <TableCell>Entreprise</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Titre</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Salaire</TableCell>
            <TableCell>Horaire</TableCell>
            <TableCell>Places</TableCell>
            <TableCell>Créée le</TableCell>
            <TableCell>Ferme le</TableCell>
            <TableCell>Début</TableCell>
            <TableCell>Fin</TableCell>
        </TableRow>
    }
    if (reportEndpoints[report].includes("contracts")) {
        header = <TableRow>
            <TableCell>Étudiant</TableCell>
            <TableCell>Entreprise</TableCell>
            <TableCell>Gestionnaire</TableCell>
        </TableRow>
    }
    return header
}

DataTableHeader.propTypes = {
    report: PropTypes.number.isRequired
}

function DataTableBody({report, rows}) {
    const parseDate = useDateParser()
    let body = undefined
    if (reportEndpoints[report].includes("student")) {
        body = rows.map(student =>
            <TableRow key={student.id}>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phoneNumber}</TableCell>
            </TableRow>
        )
    } else if (reportEndpoints[report].includes("offers")) {
        body = rows.map(offer =>
            <TableRow key={offer.id}>
                <TableCell>{offer.employer.companyName}</TableCell>
                <TableCell>{offer.employer.contactName}</TableCell>
                <TableCell>{offer.title}</TableCell>
                <TableCell>{offer.details.description}</TableCell>
                <TableCell>{offer.details.salary}</TableCell>
                <TableCell>{offer.details.startTime}&mdash;{offer.details.endTime}</TableCell>
                <TableCell>{offer.details.nbStudentToHire}</TableCell>
                <TableCell>{offer.details.creationDate}</TableCell>
                <TableCell>{parseDate(offer.details.limitDateToApply)}</TableCell>
                <TableCell>{parseDate(offer.details.internshipStartDate)}</TableCell>
                <TableCell>{parseDate(offer.details.internshipEndDate)}</TableCell>
            </TableRow>
        )
    }
    if (reportEndpoints[report].includes("contracts")) {
        body = rows.map(contract =>
            <TableRow key={contract.id}>
                <TableCell>{
                    contract.studentApplication.student.firstName + " " +
                    contract.studentApplication.student.lastName + " (" +
                    contract.studentApplication.student.studentId + ")"
                }</TableCell>
                <TableCell>{contract.studentApplication.offer.employer.companyName}</TableCell>
                <TableCell>{contract.admin.name}</TableCell>
            </TableRow>
        )
    }
    return body
}

DataTableBody.propTypes = {
    report: PropTypes.number.isRequired,
    rows: PropTypes.array.isRequired
}

function DataTable({report}) {
    const api = useApi()
    const [itemCount, setItemCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [rows, setRows] = useState([])
    //To prevent undefineds caused by rerender on report, before rows are updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const bodyMemo = useMemo(() => <DataTableBody rows={rows} report={report}/>, [rows])

    useEffect(() => {
        api.get("/reports/" + reportEndpoints[report] + "?page=" + currentPage + "&itemsPerPage=" + rowsPerPage)
            .then(response => {
                setRows(response.data.content)
                setItemCount(response.data.totalElements)
            })
    }, [currentPage, rowsPerPage, report]) // eslint-disable-line react-hooks/exhaustive-deps

    return <TableContainer>
        <Table>
            <TableHead>
                <DataTableHeader report={report}/>
            </TableHead>
            <TableBody>
                {bodyMemo}
            </TableBody>
            <TableFooter>
                <tr>
                    <TablePagination
                        component="td"
                        count={itemCount}
                        page={currentPage}
                        onChangePage={(e, page) => setCurrentPage(page)}
                        rowsPerPage={rowsPerPage}
                        onChangeRowsPerPage={({target: {value}}) => setRowsPerPage(parseInt(value))}
                    />
                </tr>
            </TableFooter>
        </Table>
        </TableContainer>
}

DataTable.propTypes = {
    report: PropTypes.number.isRequired
}

export default function Reports() {
    const classes = useStyles()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [report, setReport] = useState(0)

    return <div className={classes.main} style={{overflowY: "auto"}}>
        <Typography variant={"h5"} display={"block"} style={{marginTop: 10}}>
            &ensp;Rapport:&ensp;
            <Button onClick={() => setDrawerOpen(true)}>
                <Typography variant={"button"}>
                    <i className="fa fa-bars"/>&ensp;{reports[report]}
                </Typography>
            </Button>
        </Typography>
        <DataTable report={report}/>
        <Drawer anchor={"left"} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <List style={{width: 450}} onClick={() => setDrawerOpen(false)}>
                <ListSubheader>Rapports</ListSubheader>
                {reports.map((report, index) =>
                    <ListItem button key={index}>
                        <ListItemText primary={report} onClick={() => setReport(index)}/>
                    </ListItem>
                )}
            </List>
        </Drawer>
    </div>
}
