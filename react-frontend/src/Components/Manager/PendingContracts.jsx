import {Table, TableBody, TableContainer, TableHead, TableRow} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import TableCell from "@material-ui/core/TableCell"
import PropTypes from "prop-types"
import React, {useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import {useApi} from "../Utils/Services/Hooks"

function ContextButton({application}) {
    const history = useHistory()

    if (!application.contract)
        return <Button
            onClick={() => history.push("/dashboard/contractForm", {...application})}
            variant={"contained"}
            color={"primary"}
            style={{marginTop: 15}}
            fullWidth
        >
            <i className="fa fa-pencil-square-o"/>&ensp;Genérer le contrat
        </Button>
    else
        return <Button
            onClick={() => history.push("/dashboard/signFormAdmin", {...application.contract})}
            variant={"contained"}
            color={"primary"}
            style={{marginTop: 15}}
            fullWidth
        >
            <i className="fa fa-pencil-square-o"/>&ensp;Signer le contrat
        </Button>
}

function DataTableHeader() {
    return <TableRow>
        <TableCell>Étudiant</TableCell>
        <TableCell>Offre</TableCell>
        <TableCell>Entreprise</TableCell>
        <TableCell>Générer le contrat</TableCell>
    </TableRow>
}

function DataTableBody({rows}) {
    if (rows.length > 0)
        return rows.map(appli =>
            <TableRow key={appli.id}>
                <TableCell>{appli.student.firstName + " " + appli.student.lastName}</TableCell>
                <TableCell>{appli.offer.title}</TableCell>
                <TableCell>{appli.offer.employer.companyName}</TableCell>
                <TableCell>
                    <ContextButton application={appli}/>
                </TableCell>
            </TableRow>)
    else
        return <TableRow>
            <TableCell>Aucun élément à afficher</TableCell>
            <TableCell/>
            <TableCell/>
            <TableCell/>
        </TableRow>
}

DataTableBody.propTypes = {
    rows: PropTypes.array.isRequired
}

export default function PendingContracts({count}) {
    const api = useApi()
    const [applications, setApplications] = useState([])

    useEffect(() => {
        api.get("/applications/pending")
            .then(r => setApplications(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (count)
            count(applications.length)
    })

    return <div style={{height: "100%"}}>
        <TableContainer>
            <Table>
                <TableHead>
                    <DataTableHeader/>
                </TableHead>
                <TableBody>
                    <DataTableBody rows={applications}/>
                </TableBody>
            </Table>
        </TableContainer>
    </div>
}