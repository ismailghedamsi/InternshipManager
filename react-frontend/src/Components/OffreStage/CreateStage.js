function CreateStage() {
    return (<div> Helloworld
        <form>
            <label>Titre</label>
            <input type="text" name="title"></input>
            <label>Description</label>
            <input type="text" name="description"></input>
            <label>Employer</label>
            <input type="text"name="employer"></input>
            <label>Nom de Companie</label>
            <input type="text" name="companieName"></input>
            <label>Nombre de semaine</label>
            <input type="number" name="nombreOfWeeks"></input>
            <label>Salaire</label>
            <input type="number" name="salaire"></input>
            <label>Heure du debut</label>
            <input type="text" name="beginHour"></input>
            <label>Heure de fin</label>
            <input type="text" name="endHour"></input>
            <label>Endroit</label>
            <input type="text" name="companyLocation"></input>
            <label>Date de creation</label>
            <input type="date" name="creationDate"></input>
            <label>Limit de date</label>
            <input type="date" name="limitDateToApply"></input>
            <label>students</label>
            <input type="checkbox" name="Students"></input>
            <label>Stage</label>
            <input type="file" name="stage"></input>
            <input type="submit"/>
        </form>

    </div>);
}

export default CreateStage;