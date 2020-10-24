package com.power222.tuimspfcauppbj.service;

import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.colors.WebColors;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.AreaBreakType;
import com.itextpdf.layout.property.TextAlignment;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStream;

@Service
public class ContractGenerationService {

    public void generateContract() throws FileNotFoundException {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        OutputStream fos = new FileOutputStream("contract.pdf");
        PdfWriter writer = new PdfWriter(fos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);
        document.add(new Paragraph("CONTRAT DE STAGE").setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(document.getPageEffectiveArea(PageSize.A4).getHeight() / 2));
        document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
        Paragraph paragraph = new Paragraph(new Text("ENTENTE DE STAGE INTERVENUE ENTRE LES PARTIES SUIVANTES \n\n").setBold()
        )
                .add(new Text("Dans le cadre de la formule ATE, les parties citées ci-dessous:\n\n"))
                .add("Le gestionnaire de stage, [nom_gestionnaire]\n\n ")
                .add(new Text("et\n\n").setBold())
                .add(new Text("L'employeur,[nom_employeur]\n\n"))
                .add(new Text("et\n\n").setBold())
                .add(new Text("L'étudiant(e),[nom_etudiant,]\n\n"))
                .add(new Text("Conviennent des conditions de stage suivantes : "));
        document.add(paragraph.setTextAlignment(TextAlignment.CENTER));

        Table internshipInfoTable = new Table(1).setWidth(500f);
        internshipInfoTable.setBorder(new SolidBorder(1f));
        internshipInfoTable.addCell(new Cell().setPadding(0).setTextAlignment(TextAlignment.CENTER).setBorder(Border.NO_BORDER)
                .add(new Paragraph("ENDROIT DU STAGE").setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
        internshipInfoTable.addCell(new Cell().setPadding(0).setTextAlignment(TextAlignment.CENTER).setBorder(Border.NO_BORDER)
                .add(new Paragraph("Adresse: [offre_lieuStage]").setMultipliedLeading(1.2f)));

        internshipInfoTable.addCell(new Cell().setPadding(0).setTextAlignment(TextAlignment.CENTER).setBorder(Border.NO_BORDER)
                .add(new Paragraph("DUREE DU STAGE").setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
        internshipInfoTable.addCell(new Cell().setPadding(0).setTextAlignment(TextAlignment.CENTER).setBorder(Border.NO_BORDER)
                .add(new Paragraph("Date de début: xx\nDate de fin: xx\nNombre total de semaines: xx\n").setMultipliedLeading(1.2f)));


        internshipInfoTable.addCell(new Cell().setPadding(0).setTextAlignment(TextAlignment.CENTER).setBorder(Border.NO_BORDER)
                .add(new Paragraph("HORAIRE DE TRAVAIL").setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
        internshipInfoTable.addCell(new Cell().setPadding(0).setTextAlignment(TextAlignment.CENTER).setBorder(Border.NO_BORDER)
                .add(new Paragraph("Horaire de travail: xx\nNombre total d’heures par semaine: xxh\n").setMultipliedLeading(1.2f)));

        internshipInfoTable.addCell(new Cell().setPadding(0).setTextAlignment(TextAlignment.CENTER).setBorder(Border.NO_BORDER)
                .add(new Paragraph("SALAIRE").setMultipliedLeading(1.2f).setBackgroundColor(WebColors.getRGBColor("#DCDCDC"))));
        internshipInfoTable.addCell(new Cell().setPadding(0).setTextAlignment(TextAlignment.CENTER).setBorder(Border.NO_BORDER)
                .add(new Paragraph("Salaire horaire: [offre_tauxHoraire]").setMultipliedLeading(1.2f)));
        document.add(internshipInfoTable);
        document.close();

    }

    private static void removeBorder(Table table) {
        for (IElement iElement : table.getChildren()) {
            ((Cell) iElement).setBorder(Border.NO_BORDER);
        }
    }
}
