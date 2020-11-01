package com.power222.tuimspfcauppbj.services;

import com.icegreen.greenmail.util.GreenMail;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.service.MailSendingService;
import com.power222.tuimspfcauppbj.service.StudentApplicationService;
import com.power222.tuimspfcauppbj.util.MailContractDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("GreenMail with custom ServerSetup tests")
public class MailSendingServiceTests {
    GreenMail greenMail = new GreenMail(); //uses test ports by default
    @Mock
    private JavaMailSender javaMailSender;

    @Mock
    private StudentApplicationService applicationService;

    @Mock
    private MimeMessageHelper mimeMessageHelper;

    @InjectMocks
    private MailSendingService service;


    Employer employer = Employer.builder()
            .role("employer")
            .username("employeur")
            .password("Projet_employeur1")
            .companyName("Dacima")
            .contactName("Zack")
            .phoneNumber("5144317713")
            .address("1300 rue ducas")
            .email("projetemployeur@gmail.com")
            .build();


    MailContractDto contract = MailContractDto.builder()
            .file("JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDc5Pj5z" +
                    "dHJlYW0KeJwr5HIK4dJ3M1QwMlAISeMytDTVM7FUMLa01LOwUAhJ4TJSCCniMtAzAwJzhXIuDWd/" +
                    "v5AgxxAFF1eF4BBHd1fNkCwu1xCuQC4AR7gQRgplbmRzdHJlYW0KZW5kb2JqCjQgMCBvYmoKPDwv" +
                    "Q29udGVudHMgNSAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1BhcmVudCAyIDAgUi9SZXNvdXJj" +
                    "ZXM8PC9Gb250PDwvRjEgNiAwIFI+Pj4+L1RyaW1Cb3hbMCAwIDU5NSA4NDJdL1R5cGUvUGFnZT4+" +
                    "CmVuZG9iago4IDAgb2JqCjw8L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggNzMyPj5zdHJlYW0K" +
                    "eJyVVV1v2jAUfc+vuA+TRiVq4tiOE97SkbVIqN1C6MPUFxdMmw2SNh9M+xv7l/0Xu07o1kKhnkCx" +
                    "nNxrH59z7/Gjc5Y6g88UqAfp0gkDEnogRUgYg3Th4MvScQmHn04vvkzNH0YxTNPoPIYxzpLr+HIW" +
                    "A35IYpjEU/gSJekYx+lsfB1hwPQk/e70wDzj1PnqPL7e0AslYSA5JUzsbngwiTKXSAnSY4RJk9Ub" +
                    "qbyClYa5WpQaFhpWCpZFuW7wXZTGffxWwYMq6wzHeVY/tcPpQldV0VTD9zEKkK4gLGh3Owws4IRS" +
                    "8AOJJzCREw13uqqzIs9V1iGranWn+/BNzX9sgZbF/F7ZQPD9kHDvOAQv9JBQX1DC+S6hurYRw2eM" +
                    "cN9ajG0SFYRL+yQjOAeBuTzsmPqo1w+r4pduyj6M1DxbW1EiZEgEtaFE+JSIvaK2o0RwRoR9fW6T" +
                    "PEHEf/DIkBIPhIvHCraUPNXNIlN5fdPTNyd9OCtu4axs6qayoYYHIfHfqVc/INIHLinxu7r6VOSb" +
                    "TOe5zmusTmySIl9kpn6rv7ULVZNtEBR+3W8clwS+JwXsjuWdg63KuTBn5GEAWC/4LLWz3IfVRiL4" +
                    "NyxolFyNUxjNOgs6dC6zAFax30rWi9ATqkrDENA4XCgb7MNmrip72JQZe7KBTSXx99pgNEvi2Aq0" +
                    "i0IEW0erW7tYPN02tYEuBpQOPPe48rgGCwSRr5ZYZvkQXDZwMZ++n48mI7uOuizWt2hadVGrVSu/" +
                    "XqssN7qDtCaP8da0LMhjghG5p/nFVRKNk/baSZPoOhpPjoFnkshO9YuifLbculQbla0QtntqQaBH" +
                    "TVPsE/D7Hs2pu0eeqRhCcG/PBKqLHmnDBN41MthlYhpNDBNHoHvY8rLz06latccfdnt9eIkSzC85" +
                    "dxi2PrpiQGHtiH+TlTPdi/PwZkPEXdx28kacsZ3nFdvZoVDBxMvYbvoq+A/mVP9ACmVuZHN0cmVh" +
                    "bQplbmRvYmoKNyAwIG9iago8PC9Db250ZW50cyA4IDAgUi9NZWRpYUJveFswIDAgNTk1IDg0Ml0v" +
                    "UGFyZW50IDIgMCBSL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA2IDAgUj4+Pj4vVHJpbUJveFswIDAg" +
                    "NTk1IDg0Ml0vVHlwZS9QYWdlPj4KZW5kb2JqCjEwIDAgb2JqCjw8L0ZpbHRlci9GbGF0ZURlY29k" +
                    "ZS9MZW5ndGggODEzPj5zdHJlYW0KeJyVVttO20AQffdXzBsgtVt7L167bwFSmgrRlhj1oVTIJEvk" +
                    "yrHNrtOq/Qy+kMfmLzpLEljbcQCBZMbsOTNnzuwkt95h4r37EEBAIbnxWAgyigljkEw9fKM9n3D4" +
                    "7e0ng6OPwzEMEzgfjr98PhsPDkenowRfHV/AOBmcjAaj8+FB8tMbJt5X77ZFGxEBMuQkEpZ4/1iZ" +
                    "ic6qOisLuC7L2tQ6raqlgrdwvPyl8rKq1FwVNUz38H2eTVJ71MA3dQ21LjMDdaa0IU4+H+zP+QkW" +
                    "LLBgK0TGREqYewIT+8Emzr1xH0BIQmMHsIp7AYSKpyTrcCdEhIzIRmGruAlqdI7ygIRYCvcJk21T" +
                    "Wla0u08dUwNOYtHGnyo4KvP830yBuVPFLMU/7uG95dmHHWxhzAhfOflJwXxvDZ0q0MqYcjHVCnJl" +
                    "oNLldY5GGkAv7bu9h2elM6NA1TauF9MsLepnUsqASO6kdUXsLBSBcdiR7ZbxOuECKcKO8BRuSj1X" +
                    "2hH0IG+RwQTHNp1o/F9qjPpre1SreWWeScViQrmT7sWCaUTizpyc7i03Zb1Ori8Jl9t8LhRU6YPB" +
                    "eJHxchZKu3eRRCGVAtpPPbOsQuDtikBQBtzHifFutiwMPCYxedCWMh6dnA2Si/PutG+gIgDBtkFP" +
                    "7USmGjeHeWwDduTeDm2lJjV6NFF1reyw2l+r09R4aHuf3FKDmPDOyhwWOBaZZbld4DN30pfWiWxW" +
                    "LN/0sVLKSCB7mHfW4geE8472u80EXO6ry4M+750eclxS61H/bktN64VWV5vx/tFbtwwxowueprW6" +
                    "2s3wuCZ5EJCIPsDx2s5bcWerolwuGQmF3aUi3gRbF6k9Kyjh0aqqopy/QEyIWzdq4I5RTf/5mFrx" +
                    "j8df6hln9vPhNYCAEkG37LV5lZd/1EI/ZzBysCgkgnUM3jD0ixT46UUb8LbF2zhc0xgOCVKsTFsH" +
                    "faYxIYgQjmnPF4hTIBu4nabZHBTPdremgpky9otHkWb6aR2settDRWOkittddXl2TFtM/CZDq7F9" +
                    "NG5vaSSIjNa9XQd9vaX4PScMnnr7sjIjRnzRwDb7+x9rZpuiCmVuZHN0cmVhbQplbmRvYmoKOSAw" +
                    "IG9iago8PC9Db250ZW50cyAxMCAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1BhcmVudCAyIDAg" +
                    "Ui9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNiAwIFIvRjIgMTEgMCBSPj4+Pi9UcmltQm94WzAgMCA1" +
                    "OTUgODQyXS9UeXBlL1BhZ2U+PgplbmRvYmoKMSAwIG9iago8PC9QYWdlcyAyIDAgUi9UeXBlL0Nh" +
                    "dGFsb2c+PgplbmRvYmoKMyAwIG9iago8PC9DcmVhdGlvbkRhdGUoRDoyMDIwMTEwMTEwMzY1NS0w" +
                    "NScwMCcpL01vZERhdGUoRDoyMDIwMTEwMTEwMzY1NS0wNScwMCcpL1Byb2R1Y2VyKGlUZXh0riA3" +
                    "LjEuMTMgqTIwMDAtMjAyMCBpVGV4dCBHcm91cCBOViBcKEFHUEwtdmVyc2lvblwpKT4+CmVuZG9i" +
                    "agoxMSAwIG9iago8PC9CYXNlRm9udC9UaW1lcy1Sb21hbi9FbmNvZGluZy9XaW5BbnNpRW5jb2Rp" +
                    "bmcvU3VidHlwZS9UeXBlMS9UeXBlL0ZvbnQ+PgplbmRvYmoKNiAwIG9iago8PC9CYXNlRm9udC9I" +
                    "ZWx2ZXRpY2EvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nL1N1YnR5cGUvVHlwZTEvVHlwZS9Gb250" +
                    "Pj4KZW5kb2JqCjIgMCBvYmoKPDwvQ291bnQgMy9LaWRzWzQgMCBSIDcgMCBSIDkgMCBSXS9UeXBl" +
                    "L1BhZ2VzPj4KZW5kb2JqCnhyZWYKMCAxMgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDIyNTAg" +
                    "MDAwMDAgbiAKMDAwMDAwMjYzMiAwMDAwMCBuIAowMDAwMDAyMjk1IDAwMDAwIG4gCjAwMDAwMDAx" +
                    "NjAgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAyNTQ0IDAwMDAwIG4gCjAwMDAw" +
                    "MDEwOTIgMDAwMDAgbiAKMDAwMDAwMDI5MyAwMDAwMCBuIAowMDAwMDAyMTA2IDAwMDAwIG4gCjAw" +
                    "MDAwMDEyMjUgMDAwMDAgbiAKMDAwMDAwMjQ1MyAwMDAwMCBuIAp0cmFpbGVyCjw8L0lEIFs8NmU4" +
                    "ODY0NmM4NzhjMDU4YWY1MjUyZDQyZDRmYmVhMGU+PDZlODg2NDZjODc4YzA1OGFmNTI1MmQ0MmQ0" +
                    "ZmJlYTBlPl0vSW5mbyAzIDAgUi9Sb290IDEgMCBSL1NpemUgMTI+PgolaVRleHQtNy4xLjEzCnN0" +
                    "YXJ0eHJlZgoyNjk1CiUlRU9GCg==")
            .studentApplicationId(1L)
            .build();

    StudentApplication studentApplication = StudentApplication.builder()
            .id(1L)
            .build();


    @Test
    public void sendMailSuccess() {
        System.out.println("Service is null?" + service == null);
        service.sendEmail(employer, "contract.pdf", contract.getFile());
        verify(service, times(1)).sendEmail(employer, "contract.pdf", contract.getFile());
    }
}
