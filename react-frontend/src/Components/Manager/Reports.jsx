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
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {useApi} from "../Utils/Hooks";
import useStyles from "../Utils/useStyles";

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
    "registeredStudents",
    "studentsWithoutResume",
    "studentsPendingResumes",
    "studentsNotHired",
    "studentsScheduledInterview",
    undefined,
    "offers",
    "offersPendingApprobation",
    "offersWithoutStudents",
    undefined,
    "contracstWaitingStudent",
    "contracstWaitingEmployer",
    "contracstWaitingAdmin"
]

function StudentTable({report}) {
    const api = useApi()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [students, setStudents] = useState([])

    useEffect(() => {
        //TODO: Paging endpoint, with pageNum and num of rows param
        api.get("/reports/" + reportEndpoints[report] + "/" + page + "?itemPerPages=" + rowsPerPage)
            .then(response => setStudents(response.data))
    }, [page, rowsPerPage]) // eslint-disable-line react-hooks/exhaustive-deps

    return <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Matricule</TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Adresse courriel</TableCell>
                    <TableCell>Téléphone</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {students.map(student =>
                    <TableRow key={student.id}>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.firstName}</TableCell>
                        <TableCell>{student.lastName}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone}</TableCell>
                    </TableRow>
                )}
            </TableBody>
            <TableFooter>
                <TablePagination
                    component="div"
                    count={-1}
                    page={page}
                    onChangePage={({page}) => setPage(page)}
                    rowsPerPage={rowsPerPage}
                    onChangeRowsPerPage={({value}) => setRowsPerPage(value)}
                />
            </TableFooter>
        </Table>
    </TableContainer>
}

StudentTable.propTypes = {
    report: PropTypes.number.isRequired
}

export default function Reports() {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [report, setReport] = useState(0)

    return <div className={classes.main}>
        <Typography variant={"h5"}>
            Rapport:&ensp;
            <Button onClick={() => setDrawerOpen(true)}>
                <Typography variant={"button"}>
                    <i className="fa fa-bars"/>&ensp;{reports[report]}
                </Typography>
            </Button>
        </Typography>
        <StudentTable report={report}/>
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