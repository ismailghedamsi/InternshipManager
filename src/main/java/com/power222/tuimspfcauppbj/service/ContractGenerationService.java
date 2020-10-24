package com.power222.tuimspfcauppbj.service;

import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.AreaBreak;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.AreaBreakType;
import com.itextpdf.layout.property.TextAlignment;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStream;

@Service
public class ContractGenerationService {

    public void generateContract() throws FileNotFoundException {
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
                .add(new Text("L'étudiant(e),[nom_etudiant,]"))
                .add(new Text("Conviennent des conditions de stage suivantes : "));
        document.add(paragraph.setTextAlignment(TextAlignment.CENTER));
        document.close();

    }
}
