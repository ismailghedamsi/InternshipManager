package com.power222.tuimspfcauppbj.service;

import com.aspose.pdf.facades.PdfFileEditor;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
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
import com.power222.tuimspfcauppbj.util.ContractSignatureDTO;
import com.power222.tuimspfcauppbj.util.ContractSignatureState;
import com.power222.tuimspfcauppbj.util.UserTypes;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.joda.time.Weeks;
import org.springframework.stereotype.Service;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;

import static com.itextpdf.io.codec.Base64.encodeBytes;

@Service
@Slf4j
public class ContractGenerationService {

    private final ContractService contractService;
    private final StudentApplicationService applicationService;

    public ContractGenerationService(ContractService contractService, StudentApplicationService applicationService) {
        this.contractService = contractService;
        this.applicationService = applicationService;
    }

    public boolean generateContract(ContractDTO contractDto) {
        Optional<StudentApplication> optionalApplication = getStudentApplication(contractDto);
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
                    .add("Le gestionnaire de stage, " + contractDto.getAdminName() + "\n\n")
                    .add(new Text("et\n\n\n").setBold())
                    .add(new Text("L'employeur, " + studentApplication.getOffer().getEmployer().getCompanyName() + "\n\n"))
                    .add(new Text("et\n\n\n").setBold())
                    .add(new Text("L'étudiant(e), " + studentApplication.getStudent().getFirstName() + " " + studentApplication.getStudent().getLastName() + "\n\n"))
                    .add(new Text("Conviennent des conditions de stage suivantes : "));
            document.add(paragraph.setTextAlignment(TextAlignment.CENTER));
            addInternshipInfoTable(contractDto, document);
            document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
            document.add(new Paragraph(new Text("TACHES ET RESPONSABILITES DU STAGIAIRE\n").setBold()));
            float documentWidth = document.getPageEffectiveArea(PageSize.A4).getWidth();
            document.add(new Table(1).addCell(new Paragraph(studentApplication.getOffer().getDescription()).setWidth(documentWidth)));
            internshipPartiesResponsabilities(contractDto, document);
            document.close();
            String fileBase64 = encodeBytes(stream.toByteArray());
            contractDto.setFile("data:application/pdf;base64," + fileBase64);
            contractService.createAndSaveNewContract(contractDtoToContract(contractDto));
        }
        return stream != null;
    }

    public Optional<Contract> signContract(ContractSignatureDTO signatureDto) {
        return contractService.getContractById(signatureDto.getContractId()).flatMap(contract -> {
            if (contract.getSignatureState() != ContractSignatureState.PENDING_FOR_ADMIN_REVIEW) {
                if (signatureDto.isApproved()) {
                    contract.setFile(getContractFileWithSignature(contract, signatureDto));
                } else {
                    contract.setReasonForRejection(signatureDto.getReasonForRejection());
                }
            }

            contract.setSignatureState(ContractSignatureState.getNextState(contract.getSignatureState(), signatureDto.isApproved()));

            return contractService.updateContract(contract.getId(), contract);
        });
    }

    private String getContractFileWithSignature(Contract contract, ContractSignatureDTO signatureDto) {
        ByteArrayOutputStream appendedOut = new ByteArrayOutputStream();
        PdfDocument pdfAppendedOut = new PdfDocument(new PdfWriter(appendedOut));
        Document documentAppendedOut = new Document(pdfAppendedOut, PageSize.A4);
        float documentWidth = documentAppendedOut.getPageEffectiveArea(PageSize.A4).getWidth();

        if (ContractSignatureState.getSignerFromState(contract.getSignatureState()) == UserTypes.EMPLOYER) {
            documentAppendedOut.add(new Div()
                               .setTextAlignment(TextAlignment.JUSTIFIED)
                               .add(new Paragraph("SIGNATURES\n").setBold())
                               .setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))
                               .setWidth(documentWidth)
                               .setHeight(40f))
                    .add(new Paragraph()
                            .add(new Text("Les parties s’engagent à respecter cette entente de stage\nEn foi de quoi les parties ont signé,")
                                    .setBold()
                                    .setTextAlignment(TextAlignment.CENTER))
                            .setFirstLineIndent(15f));

            documentAppendedOut.add(
                    new Paragraph()
                            .add(new Text("\n\nL'employeur :\n").setBold())
                            .add(new Image(ImageDataFactory.create(Base64.getMimeDecoder().decode(signatureDto.getImageSignature().split(",")[1])))
                                    .scale(0.1F,0.1F))
                            .add(new Paragraph(signatureDto.getSignatureTimestamp().toString()).setMarginLeft(105f)))
                    .add(new LineSeparator(new SolidLine(1)).setMarginTop(-4))
                    .add(new Paragraph().add(new Text(signatureDto.getNomSignataire()))
                            .add(new Paragraph("Date").setMarginLeft(145f)));
        } else if (ContractSignatureState.getSignerFromState(contract.getSignatureState()) == UserTypes.STUDENT) {
            documentAppendedOut.add(
                    new Paragraph()
                            .add(new Text("\nL’étudiant(e) :\n").setBold())
                            .add(new Image(ImageDataFactory.create(Base64.getMimeDecoder().decode(signatureDto.getImageSignature().split(",")[1])))
                                    .scale(0.1F,0.1F))
                            .add(new Text(signatureDto.getSignatureTimestamp().toString()))
                            .add(new LineSeparator(new SolidLine(1)).setMarginTop(-4)))
                    .add(new LineSeparator(new SolidLine(1)).setMarginTop(-4))
                    .add(new Paragraph()
                            .add(new Text(signatureDto.getNomSignataire()))
                            .setMarginRight(120f)
                            .setMarginBottom(0)
                            .add(new Paragraph("Date\n").setMarginLeft(145f)));
        } else {
            documentAppendedOut.add(
                    new Paragraph()
                            .add(new Text("Le gestionnaire de stage :\n").setBold())
                            .add(new Image(ImageDataFactory.create(Base64.getMimeDecoder().decode(signatureDto.getImageSignature().split(",")[1])))
                                    .scale(0.1F,0.1F))
                            .add(new Paragraph(signatureDto.getSignatureTimestamp().toString()).setMarginLeft(105f)))
                            .add(new LineSeparator(new SolidLine(1)).setMarginTop(-4))
                            .add(new Paragraph(new Text(signatureDto.getNomSignataire()))
                                    .add(new Paragraph("Date").setMarginLeft(145f)));
        }

        documentAppendedOut.close();

        ByteArrayInputStream in = new ByteArrayInputStream(Base64.getMimeDecoder().decode(contract.getFile().split(",")[1]));
        ByteArrayInputStream appendedIn = new ByteArrayInputStream(appendedOut.toByteArray());

        PdfFileEditor pdfEditor = new PdfFileEditor();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        pdfEditor.concatenate(in, appendedIn, out);

        return "data:application/pdf;base64," + encodeBytes(out.toByteArray());
    }

    public Optional<StudentApplication> getStudentApplication(ContractDTO contract) {
        return applicationService.getApplicationById(contract.getStudentApplicationId());
    }

    private Contract contractDtoToContract(ContractDTO contractDto) {
        Contract contract = new Contract();
        contract.setAdminName(contractDto.getAdminName());
        contract.setFile(contractDto.getFile());
        contract.setEngagementCollege(contractDto.getEngagementCollege());
        contract.setEngagementCompany(contractDto.getEngagementCompany());
        contract.setEngagementStudent(contractDto.getEngagementStudent());
        contract.setTotalHoursPerWeek(contractDto.getTotalHoursPerWeek());
        if (applicationService.getApplicationById(contractDto.getStudentApplicationId()).isPresent()) {
            StudentApplication application = applicationService.getApplicationById(contractDto.getStudentApplicationId()).get();
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
