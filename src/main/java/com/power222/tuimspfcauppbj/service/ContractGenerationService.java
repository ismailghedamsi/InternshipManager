package com.power222.tuimspfcauppbj.service;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.WebColors;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.AreaBreakType;
import com.itextpdf.layout.property.TextAlignment;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.util.ContractDTO;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.joda.time.Weeks;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

@Service
@Slf4j
public class ContractGenerationService {

    private final ContractService contractService;
    private final StudentApplicationService applicationService;

    public ContractGenerationService(ContractService contractService, StudentApplicationService applicationService) {
        this.contractService = contractService;
        this.applicationService = applicationService;
    }

    public boolean generateContract(ContractDTO contract) {
        Optional<StudentApplication> optionalApplication = getStudentApplication(contract);
        ByteArrayOutputStream stream = null;
        if (optionalApplication.isPresent()) {
            StudentApplication studentApplication = optionalApplication.get();
            stream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(stream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);
            document.add(new Paragraph("CONTRAT DE STAGE").setBold().setFontSize(20)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(document.getPageEffectiveArea(PageSize.A4).getHeight() / 2));
            document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
            Paragraph paragraph = new Paragraph(new Text("ENTENTE DE STAGE INTERVENUE ENTRE LES PARTIES SUIVANTES \n\n").setBold()
            ).setPaddingTop(30f)
                    .add(new Text("Dans le cadre de la formule ATE, les parties citées ci-dessous:\n\n"))
                    .add("Le gestionnaire de stage, " + contract.getAdminName() + "\n\n")
                    .add(new Text("et\n\n\n").setBold())
                    .add(new Text("L'employeur, " + studentApplication.getOffer().getEmployer().getCompanyName() + "\n\n"))
                    .add(new Text("et\n\n\n").setBold())
                    .add(new Text("L'étudiant(e), " + studentApplication.getStudent().getFirstName() + " " + studentApplication.getStudent().getLastName() + "\n\n"))
                    .add(new Text("Conviennent des conditions de stage suivantes : "));
            document.add(paragraph.setTextAlignment(TextAlignment.CENTER));
            addInternshipInfoTable(contract, document);
            document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
            document.add(new Paragraph(new Text("TACHES ET RESPONSABILITES DU STAGIAIRE\n").setBold()));
            float documentWidth = document.getPageEffectiveArea(PageSize.A4).getWidth();
            document.add(new Table(1).addCell(new Paragraph(studentApplication.getOffer().getDescription()).setWidth(documentWidth)));
            internshipPartiesResponsabilities(contract, document);
            signaturesSection(document, documentWidth);
            document.close();
            String fileBase64 = com.itextpdf.io.codec.Base64.encodeBytes(stream.toByteArray());
            contract.setFile(fileBase64);
            contractService.createAndSaveNewContract(contractDtoToContract(contract, applicationService));
        }
        return stream != null;
    }

    public Optional<StudentApplication> getStudentApplication(ContractDTO contract) {
        return applicationService.getApplicationById(contract.getStudentApplicationId());
    }

    private Contract contractDtoToContract(ContractDTO contractDto, StudentApplicationService studentApplicationService) {
        Contract contract = new Contract();
        contract.setAdminName(contractDto.getAdminName());
        contract.setFile(contractDto.getFile());
        contract.setEngagementCollege(contractDto.getEngagementCollege());
        contract.setEngagementCompany(contractDto.getEngagementCompany());
        contract.setEngagementStudent(contractDto.getEngagementStudent());
        contract.setTotalHoursPerWeek(contractDto.getTotalHoursPerWeek());
        if (studentApplicationService.getApplicationById(contractDto.getStudentApplicationId()).isPresent()) {
            StudentApplication application = studentApplicationService.getApplicationById(contractDto.getStudentApplicationId()).get();
            contract.setStudentApplication(application);
        }
        return contract;
    }

    private void addInternshipInfoTable(ContractDTO contract, Document document) {
        Optional<StudentApplication> optionalApplication = getStudentApplication(contract);
        if (optionalApplication.isPresent()) {
            StudentApplication application = optionalApplication.get();
            InternshipOffer offer = application.getOffer();
            Table internshipInfoTable = new Table(1).setWidth(500f);
            internshipInfoTable.setBorder(new SolidBorder(1f));
            internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                    .add(new Paragraph("ENDROIT DU STAGE").setBold().setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
            internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                    .add(new Paragraph("Adresse : " + application.getOffer().getEmployer().getAddress()).setMultipliedLeading(1.2f)));

            internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                    .add(new Paragraph("DUREE DU STAGE").setBold().setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
            internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                    .add(new Paragraph("Date de début : " + parseDate(offer.getInternshipStartDate()) +
                            "\nDate de fin: " + parseDate(offer.getInternshipEndDate())
                            + "\nNombre total de semaines : " + dateIntervalToWeeks(offer.getInternshipEndDate(), offer.getInternshipStartDate()) + "\n").setMultipliedLeading(1.2f)));

            internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                    .add(new Paragraph("HORAIRE DE TRAVAIL").setBold().setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
            internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                    .add(new Paragraph("Horaire de travail : " + application.getOffer().getStartTime() +
                            "-" + application.getOffer().getEndTime() +
                            "\nNombre total d’heures par semaine: " + contract.getTotalHoursPerWeek() + "h\n").setMultipliedLeading(1.2f)));

            internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                    .add(new Paragraph("SALAIRE").setBold().setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
            internshipInfoTable.addCell(new Cell().setPadding(0).setBorder(Border.NO_BORDER)
                    .add(new Paragraph("Salaire : " + offer.getSalary() + "$").setMultipliedLeading(1.2f)));
            document.add(internshipInfoTable);
        }
    }

    private void signaturesSection(Document document, float documentWidth) {
        document.add(new Div().setTextAlignment(TextAlignment.JUSTIFIED).add(
                new Paragraph("SIGNATURES\n").setBold())
                .setBackgroundColor(WebColors.getRGBColor("#DCDCDC")).setWidth(documentWidth).setHeight(40f));
        document.add(new Paragraph(new Text(" Les parties s’engagent à respecter cette entente de stage\nEn foi de quoi les parties ont signé,").setBold().setTextAlignment(TextAlignment.CENTER))
                .setFirstLineIndent(15f)
                .add(new Text("\nL’étudiant(e) :\n").setBold())
                .add(new Paragraph(new Text("[signature_etudiant]\n")).setMarginRight(120f).setMarginBottom(0))
                .add(new Text("[date_signature_etudiant]"))
                .add(new LineSeparator(new SolidLine(1)).setMarginTop(-4)
                ));
        document.add(new LineSeparator(new SolidLine(1)).setMarginTop(-4));
        document.add(new Paragraph(new Text("[nom_etudiant]")).setMarginRight(120f).setMarginBottom(0)
                .add(new Paragraph("[Date]\n").setMarginLeft(145f)).add(new Text("\n\nL'employeur : ").setBold()));
        document.add(new Paragraph(new Text("[signature_employeur]"))
                .add(new Paragraph("[date_signature_employeur]").setMarginLeft(105f)))
                .add(new LineSeparator(new SolidLine(1)).setMarginTop(-4))
                .add(new Paragraph(new Text("[nom_employeur]"))
                        .add(new Paragraph("[Date]").setMarginLeft(145f)));
        document.add(new Paragraph("Le gestionnaire de stage :").setBold()).add(new Paragraph(new Text("[signature_gestionnaire]"))
                .add(new Paragraph("[date_signature_gestionnaire]").setMarginLeft(105f)))
                .add(new LineSeparator(new SolidLine(1)).setMarginTop(-4))
                .add(new Paragraph(new Text("[nom_gestionnaire]"))
                        .add(new Paragraph("[Date]").setMarginLeft(145f)));
    }

    @SneakyThrows
    private void internshipPartiesResponsabilities(ContractDTO contract, Document document) {
        PdfFont font = PdfFontFactory.createFont(StandardFonts.TIMES_ROMAN);
        document.add(new Paragraph(new Text("RESPONSABILITES\n").setBold()).setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph(new Text("Le Collège s’engage à :\n").setBold())
                .add(new Paragraph(contract.getEngagementCollege())).setFont(font)
                .add(new Text("\nL'entreprise s’engage à :\n").setBold())
                .add(new Paragraph(contract.getEngagementCompany()))
                .add(new Text("\nL'étudiant s’engage à :\n").setBold())
                .add(new Paragraph(contract.getEngagementStudent()))
        );
    }

    private String parseDate(Date date) {
        return new SimpleDateFormat("dd/MM/yy").format(date);
    }

    private int dateIntervalToWeeks(Date endDate, Date startDate) {
        return Weeks.weeksBetween(new DateTime(startDate), new DateTime(endDate)).getWeeks();
    }
}
