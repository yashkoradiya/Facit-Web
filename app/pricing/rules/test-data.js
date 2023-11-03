import { List, Record, Map } from 'immutable';
import { userStateTD } from 'appState/appState-testdata';

const appState = new (Record({ user: userStateTD, resortsList: [], dynamicAccommodation: Map() }))();

export const initialState = {
  appState
};

export const dataTD = {
  data: [
    {
      id: 3796,
      name: 'Accom comp margin 10',
      sourceMarkets: 'TUI Belgium, TUI Netherlands',
      valueType: 'Absolute',
      currency: 'EUR',
      marginBandStart: '2018-10-01T00:00:00',
      marginBandEnd: '2023-10-01T00:00:00',
      ruleType: 'accommodation_component',
      criterias: [
        {
          criteriaKey: 'producttype',
          criteriaTitle: 'Producttype',
          value: '1',
          valueTitle: 'ACCOMMODATION_ONLY',
          valueCode: 'AO',
          score: 1
        },
        {
          criteriaKey: 'producttype',
          criteriaTitle: 'Producttype',
          value: '0',
          valueTitle: 'FLY_AND_STAY',
          valueCode: 'FS',
          score: 1
        }
      ],
      assignedProducts: 0,
      properties: [],
      averageMargin: '77.333333333333333333333333333',
      firstMargin: '111.00',
      lastModifiedAt: '2022-11-29T12:23:18.591252',
      lastModifiedByUserName: 'Anshu Kumar Tiwari',
      assignedProductIds: [
        '00BAD532-C694-4CC2-8F1F-AF2FD46FE91D_3',
        '00BAD532-C694-4CC2-8F1F-AF2FD46FE91D_TEST_IN_PROD_NETHERLANDS-1',
        '00BAD532-C694-4CC2-8F1F-AF2FD46FE91D_W22-S23_NETHERLANDS',
        '00BAD532-C694-4CC2-8F1F-AF2FD46FE91D_W23',
        '00BAD532-C694-4CC2-8F1F-AF2FD46FE91D_W23-S24',
        '00BAD532-C694-4CC2-8F1F-AF2FD46FE91D_W23-S24_NETHERLANDS',
        '00BAD532-C694-4CC2-8F1F-AF2FD46FE91D_W23-S24_NETHERLANDS_8480_V1',
        '00BAD532-C694-4CC2-8F1F-AF2FD46FE91D_W23-S24_NETHERLANDS_8480_V2',
        '01BAD532-C694-4CC2-8F1F-AF2FD46FE91D_W22-S23',
        '02BAD532-C694-4CC2-8F1F-AF2FD46FE91D',
        '04836010-7284-4D46-A31D-8FA5E52C6B45_W21',
        '04836010-7284-4D46-A31D-8FA5E52C6H52_W22-S23_NETHERLANDS',
        '068F0917-7DB6-4032-8A02-5593249342',
        '068F0917-7DB6-4032-8A02-55932493428_44',
        '068F0917-7DB6-4032-8A02-55932493428A',
        '068F0917-7DB6-4032-8A02-55932493428A_9748_W22_BELGIUM',
        '068F0917-7DB6-4032-8A02-55932493428A_9748_W22_BELGIUM1',
        '068F0917-7DB6-4032-8A02-55932493428A_9748_W22_BELGIUM1A',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_1',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_2',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_3',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_4',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_BELGIUM',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_BELGIUM_1',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_BELGIUM_10090',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_BELGIUM_10090_1',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_BELGIUM_10090_FIXED',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_BELGIUM1111',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_BELGIUM_6',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_BELGIUM_7',
        '068F0917-7DB6-4032-8A02-55932493428A_W22_BELGIUM_FS_AO1',
        '068F0917-7DB6-4032-8A02-CFD-9675-TEST5',
        '093BC963-426A-4C32-ADD3-21EA0FF8C753_W21',
        '093BC963-426A-4C32-ADD3-21EA0FF8C753_W22-S23_NETHERLANDS',
        '0A023619-0627-4076-82DC-7A7D4C6648FA_W22-S23_BELGIUM',
        '0A023619-0627-4076-82DC-7A7D4C6648FA_W22-S23_NETHERLANDS1222',
        '0A1A958E-25C6-4318-B060-5E039BBA984C_W21',
        '0A1A958E-25C6-4318-B060-5E039DDE984C_W21',
        '10BDFCA3-E046-4A80-B374-E59CC84EBDD',
        '10BDFCA3-E046-4A80-B374-E59CC84EBDDD',
        '10BDFCA3-E046-4A80-B374-E59CC84EBDDD_S211',
        '10BDFCA3-E046-4A80-B374-E59CC84EBDDD_W11',
        '11211_W22-S23_NETHERLANDS TEST',
        '1593ECA3-70B0-483D-AAD4-F228B9D9DF35_S22',
        '19949576-D104-4793-8836-CC23EFF2B3FC_W22',
        '1A957088-0C17-4C33-99AC-EAC36DE861AF_W22_NETHERLANDS',
        '1A957088-0C17-4C33-99AC-EAC36DE861AF_W22_NETHERLANDS_4422',
        '1A957088-0C17-4C33-99AC-EAC36DE861AF_W22_NETHERLANDS _TEST',
        '1CCDC044-A4EC-437E-A9A5-456E425A113B_W22_BELGIUM',
        '1CCDC044-A4EC-437E-A9A5-TEST_W22_BELGIUM',
        '1CCDC044-A4EC-437E-A9A5_W22_BELGIUM',
        '1CCDC044-A4EC-437E-TEST_S22_BELGIUM',
        '1D9C66DA-388C-4103-9FCA-993CEC1C8715',
        '1D9C66DA-388C-4103-9FCA-993CEC1C8715_W22_BELGIUM',
        '1D9C66DA-388C-4103-9FCA-993CEC1C8715_W22_BELGIUM CFD-10928',
        '1F286FAA-FE68-439B-AB52-BFC10C824ABC_S22',
        '1F286FDC-FE68-439B-AB52-BFC10C824CD2_S22',
        '1F5D1B42-432B-4FA5-A2A5-3FF43155FC1B_S22',
        '1F5D1B42-432B-4FA5-A2A5-3FF43155FC1B_S22_1',
        '22D1E10E-0D0F-4183-B2FC-B4729E77B192_S23_NETHERLANDS',
        '2308E369-237C-47DD-8E91-836741F986BB_W23-S24_NETHERLANDS',
        '2308E369-237C-47DD-8E91-836741F986BB_W23-S24_NETHERLANDS1',
        '2308E369-237C-47DD-8E91-836741F986BB_W23-S24_NETHERLANDS_123',
        '261BE0D0-9EB6-4E07-91EF-6ADF157E367F_S22',
        '28B52697-05CF-4A37-A3E2-4EB2AE9507A6_S22',
        '28B52697-05CF-4A37-A3E2-4EB2AE9507A6_W22-S23_BELGIUM',
        '28B52697-05CF-4A37-A3E2-4EB2AE9507A6_W22-S23_NETHERLANDS',
        '28B52697-05CF-4A37-A3E2-4EB2AE9508H7_W22-S23_NETHERLANDS',
        '28B52697-05CF-4A37-A3E2-4EB2AE9509G4_W22-S23_NETHERLANDS',
        '2A47962B-C881-4B2B-94E7-D1EFE51C0242_S22',
        '2F0C8773-EC2B-4BA8-A379-6E7EBAF711EC_W21',
        '3038DAC9-560A-47A5-A4DD-2D56AF75A684_W21',
        '31376CB0-49BA',
        '31376CB0-49BA-4884-A',
        '31376CB0-49BA-4884-A1',
        '31376CB0-49BA-4884-A11',
        '31376CB0-49BA-4884-A1111',
        '31376CB0-49BA-4884-A915',
        '31376CB0-49BA-4884-AB05-DB7FE78',
        '31376CB0-49BA-4884-AB05-DB7FE783B2',
        '31376CB0-49BA-4884-AB05-DB7FE783B26B',
        '31376CB0-49BA-4884-AB05-DB7FE783B26BQQ',
        '31376CB0-49BA-4884-AB05-DB7FE783B26B_W21',
        '31376CB0-49BA-4884-AB05-DB7FE783B2_B1',
        '31376CB0-49BA-4884-AB05-DB7FE783B2_N1',
        '31376CB0-49BA-4884-AB05-DB7FE783B2_N2',
        '31376CB0-49BA-4884-AB05-DB7FE783B2_W21',
        '31376CB0-49BA-4884-B63',
        '31376CB0-49BA-4884-B64',
        '31376CB0-49BA-4884-B65',
        '31376CB0-49BA-4884-B66',
        '31376CB0-49BATESTAPC',
        '32376CB0-49BA-4884-AB05-DB7FE783B2_B2',
        '32376CB0-49BA-4884-AB05-DB7FE783B2_N2',
        '32376CB0-50BA-4884-AB05-DB7FE783B2_B2',
        '32376CB0-50BA-4884-AB05-DB7FE783B2_N3',
        '37C1AC69-46A1-4714-A35F-91DAC2F98693_W21',
        '37C1AC69-46A1-4714-A35F-91DAC2F98693_W211689978',
        '37C1AC69-46A1-4714-A35F-91DAC2F98693_W216899',
        '3A1FCD2F-DF5C-4B42-8694-409E4568402C_W21',
        '3A35AABB-261F-4C88-A22E-1B1B201314A6_S22',
        '3A9372AD-BC0E-4FB1-98C6-6EDD10AF756A_W22_NETHERLANDS',
        '3C9BFC2E-A1BD-4B36-8890-A5A6D656855E_W22-S23_NETHERLANDS_CFD_10621_1',
        '3C9BFC2E-A1BD-4B36-8890-A5A6D656855E_W22-S23_NETHERLANDS_CFD_10621_2',
        '3C9BFC2E-A1BD-4B36-8890-A5A6D658392U_W22-S23_BELGIUM',
        '3D8BDEE1-FE2C-48FC-9ABD-3D586CF1D87B_S22',
        '3D8BDEE1-FE2C-48FC-9ABD-3D586CF1D87B_W22-S23_BELGIUM',
        '3D8BDEE1-FE2C-48FC-9ABD-3D586CF1D87B_W22-S23_NETHERLANDS',
        '408B711F-4358-4628-9D02-D039EABC600F_S22',
        '408B711F-4358-4628-9D02-D039EABC600F_W22-S23_NETHERLANDS',
        '41BC5056-7007-42F6-90E9-A7D36D1FFF34_W21',
        '42972C17-6C1B-48A9-AF93-2DB54ECE67DC_W23-S24_BELGIUM',
        '42972C17-6C1B-48A9-AF93-2DB54ECE67DC_W23-S24_BELGIUM 2',
        '42972C17-6C1B-48A9-AF93-2DB54ECE67DC_W23-S24_BELGIUM 4',
        '42972C17-6C1B-48A9-AF93-2DB54ECE67DC_W23-S24_BELGIUM 5',
        '42972C17-6C1B-48A9-AF93-2DB54ECE67DC_W23-S24_BELGIUM 6',
        '42972C17-6C1B-48A9-AF93-2DB54ECE67DC_W23-S24_BELGIUM 7',
        '42F28506-7B63-45EF-81CD-065D63C9A65A_S221',
        '42F28506-7B63-45EF-81CD-065D63C9A65A_S221PPPW',
        '42F28506-7B63-45EF-81CD-065D63C9A65A_S221PUPW',
        '450BD30F-DDC9-4957-9E5B-5235C28D198E_W21',
        '48FBE977-5C20-4EAC-AB59-297B0DA514E9_W21',
        '48FBE977-5C20-4EAC-AB59-297B0DA514E9_W23',
        '48FBE977-5C20-4EAC-AB59-297B0DA514E9_W23_BELGIUM12',
        '4B56DD61-970A-4547-9414-FE025A436E0B_W22_BELGIUM',
        '4B56DD61-970A-4547-9414-FE025A436E0B_W22_NETHERLANDS',
        '4B56DD61-970A-4547-9414-FE025A436E0B_W22_NETHERLANDS11',
        '4BE85C0E-A873-436A-AA61-07B61B52416B_S22',
        '4BE85C0E-A873-436A-AA61-07B61B52416B_S22-W22_BELGIUM',
        '4BE85C0E-A873-436A-AA61-07B61B52416B_S22-W22_NETHERLANDS',
        '503E44C7-638C-4CA1-A298-A69A5F4BBBDA_S22',
        '518A29BC-3C58-4134-AE42-A2D66A8F2839_W22_BELGIUM_1',
        '52836FEE-ABA2-457F-B86C-5B66356ACEE8_W22_NETHERLANDS',
        '528F2E13-0A1F-4F2C-9DC3-01552C65D678_W21',
        '539C1450-4EEA-4A19-9146-1D884F6B8A64_S23_BELGIUM',
        '539C1450-4EEA-4A19-9146-1D884F6B8A64_S23_NETHERLANDS',
        '53E94526-B736-451E-8D13-CBC60C33D59C_S22',
        '53E94526-B736-451E-8D13-CBC60C33D59C_W22-S23_BELGIUM',
        '53E94526-B736-451E-8D13-CBC60C33D59C_W22-S23_NETHERLANDS',
        '53E94526-B736-451E-8D13-CBC60C33D59C_W22-S23_NETHERLANDS_CFD_11083_TEST2',
        '53E94526-B736-451E-8D13-CBC60C33D59C_W22-S23_NETHERLANDS_CFD-11372_1',
        '53E94526-B736-451E-8D13-CBC60C33D59C_W22-S23_NETHERLANDS TEST',
        '53E94526-B736-451E-8D13-CBC60C33D59C_W22-S23_T2',
        '57178FD6-5A3C-4EF7-AB20-98784A93765C_S22',
        '57178FD6-5A3C-4EF7-AB20-98784A93765C_W22_BELGIUM',
        '57178FD6-5A3C-4EF7-AB20-98784A93765C_W22_NETHERLANDS',
        '583EAF7A-F0C3-460B-86F2-CD3D8B88CB75_S23_NETHERLANDS',
        '58678DA0-82E3-4338-A145-301A73C571A8_S22',
        '5DE6F558-2B8B-4BAA-9C99-E688A5776C59_W21',
        '63AF4E8B-8CB3-4AF4-8015-6C049AA05A0B_W21',
        '6879DC75-C05B-4CAC-883D-2C4569EE30C2_S22',
        '6879DC75-C05B-4CAC-883D-2C4569EE30C2_W22-S23_BELGIUM',
        '6931904A-8CD5-47D8-9F6A-0A3FBD1CF79E_W22',
        '6A4651B6-5BFC-4423-BA4C-6161DE35777',
        '6A4651B6-5BFC-4423-BA4C-6161DE3577711',
        '6A4651B6-5BFC-4423-BA4C-6161DE3577711111',
        '6A4651B6-5BFC-4423-BA4C-6161DE35777D_S23_NETHERLANDS',
        '6AADABAB-1282-43F6-9C1C-512DF52',
        '6AADABAB-1282-43F6-9C1C-512DF52C1E11_S221',
        '6AADABAB-1282-43F6-9C1C-512DF52C1E11_S221222',
        '6ABA525E-B340-4641-9281-1288EC4DBC92_S22',
        '7400B586-E01F-46B7-A9AF-4C5EE4AF9039_W22_NETHERLANDS',
        '7431BA7B-4D66-4BCA-88B7-3A85446E9957_W21',
        '77EB04B1-8C1A-4929-9111_6488',
        '77EB04B1-8C1A-4929-9111_6488_DEV',
        '77EB04B1-8C1A-4929-9111_6488_DEV12',
        '77EB04B1-8C1A-4929-9111-FD0821338023_8512_AO_FS5_TEST',
        '77EB04B1-8C1A-4929-9222_6488',
        '77EB04B1-8C1A-4929-9222_6488_N1',
        '77EB04B1-8C1A-4929-9222_8511',
        '77EB04B1-8C1A-4929-9222_8511_AO_FS',
        '77EB04B1-8C1A-4929-9223_8511_AO_FS',
        '77EB04B1-8C1A-4929-99F5-FD0821331',
        '77EB04B1-8C1A-4929-99F5-FD082133111',
        '77EB04B1-8C1A-4929-99F5-FD0821331111111',
        '77EB04B1-8C1A-4929-99F5-FD0821331_123',
        '77EB04B1-8C1A-4929-99F5-FD0821338023_S22',
        '77EB04B1-8C1A-4929-99F5-FD0821338023_W22-S23_NETHERLANDS',
        '77EB04B1-8C1A-4929-99F5-FD08213381',
        '77EB04B1-8C1A-4929-99F5-FD08213381_BHARATH_8',
        '77EB04B1-8C1A-7555-99F5-FD0821331',
        '77EB04B1-8C1A-7666-99F5-FD0821331',
        '77EB04B1-8C1A-7888-99F5-FD0821331',
        '77EB04B1-8C1A-7888-99F5-FD0821331111',
        '77EB04B1-8C1A-7888-99F5-FD082133111122Q',
        '77EB04B1-8C1A-7888-99F5-FD082133111122Q_2',
        '77EB04B1-8C1A-7888-99F5-FD082133111122Q_3',
        '77EB04B1-8C1A-7999-99F5-FD0821331',
        '78EA84E8-FC40-4870-9136-D95BA0B5DAAE_W22-S23_NETHERLANDS',
        '78EA84E8-FC40-4895-9136-D95BA0B5DAAE_W22-S23_NETHERLANDS',
        '797DE996-51D1-4D31-9316-80784B6E3EC3_W21',
        '797DE996-51D1-4D31-9316-80784B6E3EC3_W22-S23_NETHERLANDS',
        '7B44A786-8D4D-4B43-88EA1',
        '7B44A786-8D4D-4B43-88EA-A02323',
        '7B44A786-8D4D-4B43-88EA-A0232336376C_W2122',
        '7B44A786-8D4D-4B43-88EA-TEST28',
        '808CA50A-3EDD-4024-8CEC-BBBBB72DA073',
        '808CA50A-3EDD-4024-8CEC-DDDDD72DA073',
        '808CA50A-3EDD-4024-8CEC-DECAA00DA999_AGE_3',
        '808CA50A-3EDD-4024-8CEC-DECAA11DA999_AGETEST',
        '808CA50A-3EDD-4024-8CEC-DECBB72DA073_W21',
        '808CA50A-3EDD-4024-8CEC-DECBB72DA999_AGE',
        '808CA50A-3EDD-4024-8CEC-DECBB72DA999_AGE2',
        '808CA50A-3EDD-4024-8CEC-DECBB72DA999_W21',
        '808CA50A-3EDD-4024-8CEC-FFFFF72DA073',
        '808CA50A-3EDD-4024-8CEC-HHHHH72DA073',
        '808CA50A-3EDD-4024-8CEC-RRRRR72DA073',
        '808CA50A-3EDD-4024-8CEC-YYYYY72DA073',
        '808CA50A-3EDD-4024-8CEC-ZZZZZ72DA073',
        '81A4677B-39AD-4239-8182',
        '81A4677B-39AD-4239-81821',
        '81A4677B-39AD-4239-818212',
        '81A4677B-39AD-4239-8182123',
        '81A4677B-39AD-4239-8182-CF1EE4E80',
        '/81A4677B-39AD-4239-8182-CF1EE4E80BA3_S22',
        '81A4677B-39AD-4239-8182-CF1EE4E80BA3_S22',
        '81A4677B-39AD-4239-8182-CF1EE4E80BA3_S2211381',
        '81A4677B-39AD-4239-8182-CF1EE4E80BA3_S2211432',
        '81A4677B-39AD-4239-8182-CF1EE4E80BA3_S22_CFD-11354',
        '81A4677B-39AD-4239-8182-CF1EE4E80BA3_S22 TEST COMMISION MARKER',
        '81A4677B-39AD-4239-8182-CF1EE4E80BA3_S22 TEST COMMISION MARKER TEST 1',
        '8359111111',
        '83591234',
        '8359123411',
        '8359 TESTING1234455511',
        '83E9906A-3E4D-423A-A1E2-DD2333A48B8D_S22',
        '8474-TEST',
        '8741 TESTING1234455511',
        '888BBCAA-8AC7-4EDB-B6A4-A7040CAC00F2_S23_NETHERLANDS',
        '88TUIBE',
        '89A4C928-7442-4935-8CFA-408C1E78BAD0_S22',
        '89A4C928-7442-4935-8CFA-408C1E78BAD0_W22-S23_BELGIUM',
        '8A71D963-DB80-44C7-AC72-5E5875581605_W21',
        '8A71D963-DB80-44C7-AC72-5E5875581942_W21',
        '8B714504-92D2-42DB-A757-B12F17F791CC_S22',
        '8B714504-92D2-42DB-A757-B12F17F791CC_W22-S23_BELGIUM',
        '8B714504-92D2-42DB-A757-B12F17F791CC_W22-S23_NETHERLANDS',
        '8BA5D5F1-D2D3-4F4D-9DB3-4C847C57ADF5_W22_NETHERLANDS',
        '8C7E5905-8806-40BA-8BE6-7AA6CFAA5C72_S22',
        '8C7E5905-8806-40BA-8BE6-7AA6CFAA5C72_W22-S23_BELGIUM',
        '8C7E5905-8806-40BA-8BE6-7AA6CFAA5C72_W22-S23_NETHERLANDS',
        '8CE80227-5587-480E-8ECC-D0D8D38C0F1C_W22-S23_NETHERLANDS',
        '8D182A58-5C28-4C33-B65D-446266124095_W21',
        '8F9946EB-5945-4CE5-91D5-3944F98B1CD9_W21',
        '907546D8-EA0B-4329-9179-F10E5A73D03C_W21',
        '9176 PER STAY MISC COST',
        '932ABFCA-D400-47B8-B573-0063628C028E_S22',
        '932ABFCA-D400-47B8-B573-0063628C028E_W22-S23_BELGIUM',
        '932ABFCA-D400-47B8-B573-0063628C028E_W22-S23_NETHERLANDS',
        '9599D320-B0AC-436C-A059-9CD011F9E65C_S22',
        '9599D320-B0AC-436C-A059-9CD011F9E65C_S23-W23_NETHERLANDS',
        '96DC612E-B5E0-4BDF-99EE-FDD0BC8F53B3_W21',
        '97EA84E8-FC40-4895-9136-D95BA0B5DAAE_S22',
        '97EA84E8-FC40-4895-9136-D95BA0B5DAAE_W22-S23_BELGIUM',
        '97EA84E8-FC40-4895-9136-D95BA0B5DAAE_W22-S23_NETHERLANDS',
        '97EA8C63-AA21-4D55-9EA4-F165A2E3982F_S22',
        '980BBA50-7317-4969-8745-8B73661FF247_W22-S23_NETHERLANDS',
        '9900DISC',
        '992C7D1E-0BB4-4F3A-B441-4FFCC5B440D2_S22',
        '99EB04B1-8C1A-4929-99F5-FD0821338023_8512_AO_FS5_3',
        '9B32C6E6-CE5E-4494-B7D0-8578030CDF30_S22',
        '9B32C6E6-CE5E-4494-B7D0-8578030CDF30_W22_BELGIUM1',
        '9D436645-4853-4848-9EB5-0C3DE2D99A33_W21',
        '9D436645-4853-4848-9EB5-0C3DE2D99U66_W21',
        '9D6BF5F6-14AC-4D3E-97E7-E4E4808DF75B_S22',
        '9D6BF5F6-14AC-4D3E-97E7-E4E4808DF75B_W22_BELGIUM',
        '9D6BF5F6-14AC-4D3E-97E7-E4E4808DF75B_W22_NETHERLANDS',
        '9D6BF5F6-14AC-4D3E-97E7-E4E4808DF75B_W23_BELGIUM',
        '9D7269AB-8666-4834-8849-6EEA99A9F4B5_W22_BELGIUM',
        '9D7269AB-8666-4834-8849-6EEA99A9F4B5_W22_BELGIUM111',
        '9EAC2726-E1D2-4F6C-878F-D5BD26C7512',
        '9EAC2726-E1D2-4F6C-878F-D5BD26C7512F_W21',
        '9EAC2726-E1D2-4F6C-878F-D5BD26C7512F_W22-S23',
        '9EAC2726-E1D2-4F6C-878F-D5BD26C7512F_W22-S23_BELGIUM',
        '9EAC2726-E1D2-4F6C-878F-D5BD26C7512F_W22-S23_BELGIUM111',
        '9EAC2726-E1D2-4F6C-878F-D5BD26C7512F_W22-S23_BELGIUM_CFD_9426_TEST4_FS_AO',
        '9EAC2726-E1D2-4F6C-878F-D5BD26C7512F_W22-S23_BELGIUM_TEST',
        'A332B7DB-DFC1-4AF7-AAEA-325C36328629_S22',
        'A332B7DB-DFC1-4AF7-AAEA-325C36328629_S221',
        'A358EC7D-859C-49EC-B91F-1661A398C3B6_W22_BELGIUM',
        'AAC4204E-D2AF-4BA5-B887-417032F31C1A_W22-S23_BELGIUM',
        'AAF91083-09E8-4160-A371-FAC13E7CEF46_W21',
        'ACCOMM_7_FNO_10123',
        'ACCOMM_7_FNO_NCD',
        'AF089475-0513-437A-91AD-70ADEC4856AB_W22',
        'AF089475-0513-437A-91AD-70ADEC4856AB_W22TEST',
        'AF089475-0513-437A-91AD-70ADEC4856AB_W22TEST1',
        'AF089475-0513-437A-91AD-70ADEC4856AB_W22TEST2',
        'AF089475-0513-437A-91AD-70ADEC4856AB_W22TEST3',
        'AF2F12E0-751A-4F48-A9F7-050A90D42F6E_W22_BELGIUM',
        'AF2F12E0-751A-4F48-A9F7-050A90D42F6E_W22_NETHERLANDS',
        'AF8EFD0A-42C4-4FED-9B62-705B29B8204A_S22',
        'AF8EFD0A-42C4-4FED-9B62-705B29B8204A_W22-S23_NETHERLANDS',
        'APC-1-ROOM',
        'APC-1-ROOM_S22',
        'APC_CRUISE_W22',
        'APC-WITH-2-ROOMS_W22_NETHERLANDS',
        'APC-WITH-3-ROOMS_S22',
        'APC-WITH-5-ROOM-TEST_W22-S23_NETHERLANDS',
        'APC-WITH-8-ROOM-TEST',
        'B09D2AED-89C9-4647-9B9E-A3E4955CAF26_S22',
        'B09D2AED-89C9-4647-9B9E-A3E4955CAF26_W21',
        'B09D2AED-89C9-4647-9B9E-A3E4955CAF26_W22_BELGIUM',
        'B09D2AED-89C9-4647-9B9E-A3E4955CAF26_W22_NETHERLANDS',
        'B597A003-98F4-4128-8FB5-FB8125E22090-TEST',
        'B597A003-98F4-4128-8FB5-FB8125E22090_W22_NETHERLANDS',
        'B597A003-98F4-4128-8FB5-FB8125E22090_W22_SWEDEN',
        'B606BE00-EFD1-4D30-8630-1A1C7EFBA85B_S22',
        'B606BE00-EFD1-4D30-8630-1A1C7EFBA85B_S22TEST',
        'B606BE00-EFD1-4D30-8630-1A1C7EFBA85B_S22TEST11',
        'B652732E-DCE4-4D10-8399-5A4074BA59EA_W21',
        'B784D012-C391-4ADC-8193-8050E627C324_S22',
        'C34E8DFC-7220-4F62-BCDE-7C6495370403_S22 TEST',
        'C35189E9-67FB-4705-9E1F-E5D884F89099_S22',
        'C35189E9-67FB-4705-9E1F-E5D884F89099_W22-S23_BELGIUM',
        'C35189E9-67FB-4705-9E1F-E5D884F89099_W22-S23_NETHERLANDS',
        'C7CD01F3-F9A5-42B0-9AEF-8B34E3D5E6EC_W22_NETHERLANDS',
        'CA237259-80B1-4A5C-8E2E-A50F2206A050_S22',
        'CA237259-80B1-4A5C-8E2E-A50F2206A050_S22 TEST',
        'CA237259-80B1-4A5C-8E2E-A50F2206A050_S22 TEST AUTO',
        'CA237259-80B1-4A5C-8E2E-A50F2206A050_S22 TEST AUTO AO',
        'CD28CE5F-8F56-4627-B471-D1317A71FCBB_W21',
        'CED3EA4E-F18B-4659-A746-6645DC988C96_1111',
        'CED3EA4E-F18B-4659-A746-6645DC988C96_11111111',
        'CED3EA4E-F18B-4659-A746-6645DC988C96_1111_2_EBD_ARANGE',
        'CED3EA4E-F18B-4659-A746-6645DC988C96_1111_CFD_9431',
        'CED3EA4E-F18B-4659-A746-6645DC988C96_1111_CFD_9431_2',
        'CED3EA4E-F18B-4659-A746-6645DC988C96_2222',
        'CED3EA4E-F18B-4659-A746-6645DC988C96_7878',
        'CED3EA4E-F18B-4659-A746-6645DC988C96_W21',
        'CFD-11463 SCENARIO WITH REPETABLE AND PROLONGABLE WITH OFFER PRC',
        'CFD_9122_ACCOM_01',
        'CFD_9450_W22_S23_BELGIUM_202001',
        'CFD_9450_W22_S23_BELGIUM_ONLY',
        'CFD_9450_W22_S23_NETHERLANDS_202002',
        'CFD_9450_W22_S23_NETHERLANDS_ONLY',
        'CFD-9538-TEST',
        'D0859821-1BB0-4F4D-B89F-1A262168AFB2_W22_NETHERLANDS',
        'D0859821-1BB0-4F4D-B89F-1A262168AFB2_W22_NETHERLANDS_11195_PUPN_PUPW_EBD_ADC',
        'D0983C94-FF15-43D3-A72E-71B0FD728046_W21',
        'D305DE09-E799-455A-93DE-12B87C0C1E22_W22-S23_BELGIUM',
        'D305DE09-E799-455A-93DE-12B87C0C1E22_W22-S23_NETHERLANDS',
        'D757A846-69A9-405C-B6F7-3C5F677E820C_W22-S23_NETHERLANDS',
        'DFDCEBA9-D9F0-4765-BA42-DCC578677611_W22_NETHERLANDS',
        'DISCOUNT 8988',
        'DISCOUNTBYAGERANGE_1',
        'DISCOUNTBYAGERANGE_2',
        'DV1TEST11342',
        'DV1TEST1134212',
        'E71C8D5C-5A4C-49CA-934A-E4D7B3EDB20D_S22-W22_BELGIUM',
        'E71C8D5C-5A4C-49CA-934A-E4D7B3EDB85T_S22-W22_BELGIUM',
        'E71C8D5C-5A4C-49CA-934A-E4D7B3EHF727_S22-W22_BELGIUM',
        'E71C8D5C-5A4C-49CA-934A-E4D7B3EHF748_S22-W22_BELGIUM',
        'E71C8D5C-5A4C-49CA-934A-E4D7B3EHF930_S22-W22_BELGIUM',
        'E71C8D5C-5A4C-49CA-934A-E4D7B3HTF57R_S22-W22_BELGIUM',
        'EA142C24-ABC6-44A2-BEBB-3603FDEC5331_W22_BELGIUM',
        'EABF98EC-816D-4B77-9BC1-7AB994069152_W21',
        'ED970351-3421-4D4D-8AB6-214AA7A482E8_W21',
        'F0A7923C-2ACD-486C-9E30-037BBB9D39A2_S22',
        'F20EC931-1C0D-4C20-BE38-042BBF47A64C_W21',
        'F20EC931-1C0D-4C20-BE38-042BBF47A64C_W22-S23_BELGIUM',
        'F20EC931-1C0D-4C20-BE38-042BBF47A64C_W22-S23_NETHERLANDS',
        'F27F5339-574E-4400-A635-B9071343662B_W21',
        'F4C60743-0DDF-482A-ABB5-0F17B6061F6',
        'F5B59EB0-D09B-4C52-B515-18CBCB867197_W23-S24_BELGIUM',
        'F5B59EB0-D09B-4C52-B515-18CBCB867197_W23-S24_NETHERLANDS',
        'F5B59EB0-D09B-4C52-B515-18CBCB867197_W23-S24_NETHERLANDS11',
        'FACEIT_TEST1_8512_AO_FS_S22',
        'FACEIT_TEST1_8512_AO_FS_W2122',
        'FACEIT_TEST1_8608_AO_FS_S22',
        'FACEIT_TEST1_9006_AO_FS_S22',
        'FACEIT_TEST1_9006_AO_FS_S22_1',
        'FACEIT_TEST1_9629_AO_FS_S22_1',
        'FACIT TEST123',
        'FACIT TEST1234',
        'FACIT TEST123_9006',
        'FACIT TEST123_9006_AUTO',
        'FACIT TEST 8608_PPPW',
        'FACIT TEST 8608_PPPW_1',
        'FACIT TEST 8608_PPPW_2',
        'FACIT TEST 8608_PPPW_3',
        'FACIT TEST 8608_PPPW_4',
        'FACIT TEST 8608_PPPW_5',
        'FACIT TEST 8608_PPPW_6',
        'FACIT TEST 8608_PPPW_7',
        'FACIT TEST 8898_1',
        'FACIT TEST 8898_2',
        'FACIT TEST 9006',
        'FACIT TEST 9039_1',
        'FACIT TEST 9039_2',
        'FACIT TEST 9039_3',
        'FACIT TEST 9211_1',
        'FACIT TEST ACCOM11182471233333TEST',
        'FACIT TEST ACCOM1118247123 9006_ISSDEV',
        'FACIT TEST ACCOM_DISC_9205',
        'FACIT TEST ACCOM_TEST_DISC_9205',
        'FACIT TEST ACCOM_TEST_DISC_A1',
        'FACIT TEST ACCOM_TEST_DISC_N',
        'FACIT TEST ACCOM_TEST_DISC_N1',
        'FACIT TEST ACCOM_TEST_DISC_N3',
        'FACIT TEST ACCOM_TEST_DISC_N4',
        'FACIT TEST ACCOM_TEST_DISC_N5',
        'FACIT TEST ACCOM_TEST_DISC_N6',
        'FACIT TEST ACCOM_TEST_DISC_N7',
        'FACIT TEST ACCOM_TEST_DISC_N8',
        'FACIT TEST ACCOM_TEST_DISC_N9',
        'FACITTEST_DISCOUNT2',
        'FACITTEST_DISCOUNTNOV199',
        'FACIT TEST INACTIVE_DISC_9205',
        'FACIT TEST INACTIVE_DISC_9205_1',
        'FD2454D6-02DA-476D-8B18-84E37088C3BF_W21',
        'FD2454D6-02DA-476D-8B18-84E37088C3BF_W22_BELGIUM',
        'FF970B41-02C1-4E5A-A6AE-86A8FE76984A_W21',
        'ISSUE1 11417 WITH OFFERMETHOD NO',
        'OCCUPANCY_MATRIX_ISSUE_W22_BELGIUM',
        'OCCUPANCY_MATRIX_ISSUE_W22_BELGIUM_D23',
        'OCCUPANCY_MATRIX_ISSUE_W22-S23_NETHERLANDS',
        'PPPW AND PUPW TESTING',
        'PPPW TESTING',
        'SINGLEROOMWITHPUPNOVERRIDE',
        'SUPPLEMENT2_APC-8226-TEST',
        'SUPPLEMENT6_APC',
        'SUPPLEMENT6_APC1',
        'TEST113421',
        'TEST 11342 DV1',
        'TEST-11346-PRODINV',
        'TEST1 ACCOM1118247123_TEST123',
        'TEST1 ACCOM1118247123_TEST1234',
        'TEST1 ACCOM1118247123_TEST12345',
        'TEST210641',
        'TEST6_9053',
        'TEST-8474',
        'TEST-9487',
        'TEST-9530_S22',
        'TEST-9530_W21',
        'TEST-9530_W22_BELGIUM',
        'TEST-9530_W22_BELGIUM-1',
        'TESTCFD-11339',
        'TEST-CFD-8474',
        'TEST-INACTIVEDISC',
        'TESTLOCAL FINAL',
        'TESTSALESFAIL789'
      ],
      flightTemplateType: ''
    }
  ],
  dataSetKey: '5b117e47-d253-b020-6af0-fe1987706dd2'
};

export const searchBoxDataTD = [
  {
    criteriaKey: 'producttype',
    title: 'Product type',
    values: List([
      Map({
        id: '1',
        name: 'ACCOMMODATION_ONLY',
        code: null,
        parentIds: null
      })
    ])
  },
  {
    criteriaKey: 'sourcemarket',
    title: 'Source market',
    values: List([
      Map({
        id: 'TUI_BE',
        name: 'TUI Belgium',
        code: null,
        parentIds: null
      })
    ])
  },
  {
    criteriaKey: 'season',
    title: 'Planning period',
    values: List([
      Map({
        id: 'W23-S24',
        name: 'Winter 2324-Summer 24',
        code: 'W23-S24'
      })
    ])
  },
  {
    criteriaKey: 'country',
    title: 'Country',
    values: List([
      Map({
        id: '61eb9550-6fe5-5c28-9af8-0cfa4fe702cd',
        name: 'Åland Islands',
        code: 'AX'
      })
    ])
  },
  {
    criteriaKey: 'destination',
    title: 'Destination',
    values: List([
      Map({
        id: '19cfed27-ac78-5c19-870d-db250c9809a9',
        name: 'Aargau',
        code: '19cfed27-ac78-5c19-870d-db250c9809a9',
        parentIds: '135b9a7b-c5bf-5cdb-af4f-36474ef0ff0b'
      })
    ])
  },
  {
    criteriaKey: 'resort',
    title: 'Resort',
    values: List([
      Map({
        id: '653e5264-21e4-5e6a-a05e-f8c337bc6506',
        name: 'Aabenraa',
        code: '653e5264-21e4-5e6a-a05e-f8c337bc6506',
        parentIds: '12c7bb72-da63-5493-a7a8-dcd73292e26c'
      })
    ])
  },
  {
    criteriaKey: 'accommodation',
    title: 'Accommodation',
    values: List([
      Map({
        id: 'TEST210641',
        name: '10641test2 test210641 (Winter 2223)',
        code: '10641test2',
        parentIds: 'a3ed6486-a191-592a-a801-0f8a1554c507'
      })
    ])
  },
  {
    criteriaKey: 'classification',
    title: 'Classification',
    values: List([
      Map({
        id: '2a55498f-ac84-407b-af7f-5148d9e05477',
        name: '2',
        parentIds: 'D0859821-1BB0-4F4D-B89F-1A262168AFB2_W22_NETHERLANDS_11195_PUPN_PUPW_EBD_ADC'
      })
    ])
  },
  {
    criteriaKey: 'concept',
    title: 'Concept',
    values: List([
      Map({
        id: '0effaaa2-7715-433d-8b11-35f211e40584',
        name: 'BestFamily',
        parentIds: '30070C62-D700-4BFC-9631-2A663A39305A'
      })
    ])
  },
  {
    criteriaKey: 'label',
    title: 'Label',
    values: List([
      Map({
        id: 'Label_id',
        parentIds: '808CA50A-3EDD-4024-8CEC-RRRRR72DA073'
      })
    ])
  },
  {
    criteriaKey: 'destinationairport',
    title: 'Destination airport',
    values: List([
      Map({
        id: '6706738a-a5cf-571d-a5c2-dca81119e4dd',
        name: 'Agadir Almassira Airport (AGA) (AGA)',
        parentIds: 'MF2591'
      })
    ])
  },
  {
    criteriaKey: 'roomtypecategory',
    title: 'Room category',
    values: List([
      Map({
        id: 'X',
        name: 'X',
        parentIds: 'A0302228'
      })
    ])
  },
  {
    criteriaKey: 'contractlevel',
    title: 'Contract level',
    values: List([
      Map({
        id: 'committed',
        name: 'Committed',
        parentIds: 'CFD-9538-TEST'
      })
    ])
  },
  {
    criteriaKey: 'departureairport',
    title: 'Departure airport',
    values: List([
      Map({
        id: '6706738a-a5cf-571d-a5c2-dca81119e4dd',
        name: 'Agadir Almassira Airport (AGA) (AGA)',
        parentIds: 'MF1469'
      })
    ])
  },
  {
    criteriaKey: 'airline',
    title: 'Airline',
    values: List([
      Map({
        id: 'EK',
        name: ' (EK)',
        parentIds: 'MF3733'
      })
    ])
  },
  {
    criteriaKey: 'weekday',
    title: 'Weekday',
    values: List([
      Map({
        id: 'WD1',
        name: 'Monday'
      })
    ])
  },
  {
    criteriaKey: 'accommodationcode',
    title: 'accommodationcode',
    values: List([
      Map({
        id: '10641test2',
        name: '10641test2 test210641',
        code: '10641test2',
        parentIds: 'a3ed6486-a191-592a-a801-0f8a1554c507'
      })
    ])
  },
  {
    criteriaKey: 'area',
    title: 'Area',
    values: List([
      Map({
        id: 'AREACODE1',
        name: 'SAMPLE AREA',
        code: 'AREACODE1'
      })
    ])
  },
  {
    criteriaKey: 'airport',
    title: 'Airport',
    values: List([
      Map({
        id: '72d93c18-0253-5ff9-9f1d-a67cba8567bd',
        name: 'Aalborg Airport (AAL)',
        code: 'AAL',
        parentIds: 'b35f1dc8-4010-5a0b-abe2-05d07ec26bf5'
      })
    ])
  },
  {
    criteriaKey: 'transfer_type',
    title: 'Transfer type',
    values: List([
      Map({
        id: 'Coach',
        name: 'Coach',
        parentIds: '583'
      })
    ])
  },
  {
    criteriaKey: 'transfer_type',
    title: 'Transfer type',
    values: List([
      Map({
        id: 'All',
        name: 'All'
      })
    ])
  },
  {
    criteriaKey: 'value_type',
    title: 'Value type',
    values: List([
      Map({
        id: 'Absolute',
        name: 'Absolute'
      })
    ])
  },
  {
    criteriaKey: 'transfer_direction',
    title: 'Direction',
    values: List([
      Map({
        id: 'Airport-Area',
        name: 'Airport-Area',
        parentIds: '632'
      })
    ])
  },
  {
    criteriaKey: 'transfer_direction',
    title: 'Direction',
    values: List([
      Map({
        id: 'Airport-Area',
        name: 'Airport - Area'
      })
    ])
  },
  {
    criteriaKey: 'cost_label',
    title: 'Cost label',
    values: List([
      Map({
        id: 'Transfer',
        name: 'Transfer',
        code: null,
        parentIds: null
      })
    ])
  },
  {
    criteriaKey: 'product_type_for_vat',
    title: 'Product type',
    values: List([
      Map({
        id: 'vat',
        name: 'Accommodation',
        code: null,
        parentIds: null
      })
    ])
  },
  {
    criteriaKey: 'flight_template_type',
    title: 'Template types',
    values: List([
      Map({
        id: 'Flight Margin',
        name: 'Flight Margin',
        code: null,
        parentIds: null
      })
    ])
  },
  {
    criteriaKey: 'rule_type',
    title: 'Rule type',
    values: List([
      Map({
        id: 'accommodation_only',
        name: 'Acc. only',
        code: null,
        parentIds: null
      })
    ])
  }
];

export const selectedSecondaryFiltersTD = List();

export const selectedRuleTypesTD = List(['accommodation_component']);

export const selectedSourceMarketsTD = List();
