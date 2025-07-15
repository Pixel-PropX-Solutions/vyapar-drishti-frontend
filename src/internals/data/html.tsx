export const html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Vyapar Drishti Invoice Template</title>
    <style>
        * {
            box-sizing: border-box !important;
        }

        body {
            margin: 0 !important;
            font-family: Arial, sans-serif !important;
            /* width: 210mm !important;
            padding: 10mm !important; */
        }

        @media print {
            body {
                margin: 0;
                padding: 10mm !important;
            }

            .no-print {
                display: none !important;
            }
        }
    </style>
</head>

<body>
    
    
    <!-- Main Invoice Table Container -->
    <table style="width: 190mm !important;
            align-self: center !important;
            vertical-align: top !important;
            max-height: 280mm !important;
            padding: 0mm !important;
            margin: 10mm !important;
            border: 1px solid #000 !important;
            overflow: hidden !important;
            page-break-after: always !important; 
            border-collapse: collapse !important;" cellpadding="0" cellspacing="0">

        <!-- Header Section -->
        <tr>
            <td>
                <table style="width: 100% !important; border-collapse: collapse;" cellpadding="0" cellspacing="0">

                    <!-- Company Details -->
                    <tr>
                        <td colspan="2" style="border-bottom: 1px solid #000 !important; padding: 2mm !important;">
                            <!-- Company Details -->
                            <table
                                style="text-align: center !important; width: 100% !important; border-collapse: collapse;"
                                cellpadding="1" cellspacing="0">
                                <tr>
                                    <td style="font-size: 18px !important; 
                                        font-weight: bold !important; 
                                        margin-bottom: 2mm !important;">
                                        Quality Auto Parts
                                    </td>
                                </tr>
                                <tr>
                                    <td>Near Petrol Pump, Pasund</td>
                                </tr>
                                <tr>
                                    <td>Rajasthan, India - 313424</td>

                                </tr>
                                <tr>
                                    <td><strong>Phone :</strong> +91&nbsp;6367097548,&nbsp;<strong>Email :</strong> qualityautoparts@gmail.com</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Party Details and Invoice Details -->
                    <tr style="border-bottom: 1px solid #000 !important;">
                        <!-- Party Details Details -->
                        <td style="font-size: 14px !important; padding: 2mm !important; vertical-align: top;">
                            <table>
                                <tr>
                                    <td style="font-weight: bold; padding-bottom: 1mm !important;">Vikas Auto Ajency
                                    </td>
                                </tr>
                                <tr>
                                    <td>Near Police Station, Karol Bagh</td>
                                </tr>
                                <tr>
                                    <td>Delhi, India - </td>

                                </tr>
                                <tr>
                                    <td><strong>Phone : </strong>+91&nbsp;7689548765</td>
                                </tr>
                                <tr>
                                    <td><strong>Email :</strong> vikasauto@gmail.com</td>
                                </tr>
                            </table>
                        </td>

                        <!-- Invoice Details -->
                        <td
                            style="font-size: 14px !important; vertical-align: top !important; text-align: left !important; border-left: 1px solid #000; padding-top: 1mm !important; padding-left: 2mm !impoertant;">
                            <table>
                                <tr>
                                    <td style="font-weight: bold;">Invoice No</td>
                                    <td style="">:</td>
                                    <td>PUR-0002</td>
                                </tr>
                                <tr>
                                    <td style=" font-weight: bold;">Invoice Date</td>
                                    <td style="">:</td>
                                    <td>2025-07-15</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold;">Place of Supply</td>
                                    <td style="">:</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold;">Mode of Transport
                                    </td>
                                    <td style="">:</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold;">Vehicle No</td>
                                    <td style="">:</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold;">Payment Status</td>
                                    <td style="">:</td>
                                    <td></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Invoice Header -->
                    <tr>
                        <td colspan="2"
                            style="text-align: center; padding: 8px; background-color: #f2f2f2; border-bottom: 1px solid #000; font-size: 16px; font-weight: bold;">
                            Purchase&nbsp;Invoice<span>&nbsp;PUR-0002</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>


        <!-- Product Details Table -->
        <tr>
            <td style="padding-top: 2mm !important;">
                <table
                    style="width: 100% !important; text-wrap: nowrap; white-space: nowrap; border-collapse: collapse !important; border-top: 1px solid #000 !important; font-size: 10px !important;"
                    cellpadding="0" cellspacing="0">

                    <!-- Product Details Header -->
                    <tr
                        style="width: 100% !important;  background-color: #f2f2f2 !important; height: 5mm !important;  font-weight: bold !important;">
                        <th
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            SN</th>
                        <th
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            Description of Goods</th>
                        <th
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            Qty.</th>
                        <th
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            Pack</th>
                        <th
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            RATE</th>
                        <th style="border-bottom: 1px solid #000 !important; text-align: center;">
                            AMOUNT</th>
                    </tr>
                    
                    
                    
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            1</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            HLV SPL BLK SILVER</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            10</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            100.0</td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            1000.0</td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            2</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            3</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            4</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            5</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            6</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            7</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            8</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            9</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            10</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            11</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            12</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            13</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            14</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            15</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            16</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            17</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            18</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            19</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            20</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            21</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            22</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            23</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            24</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            25</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            26</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            27</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    
                    <!-- Product Details Row -->
                    <tr style="width: 100% !important; height: 5mm !important; background-color: #f9f9f9 !important;"
                        style="width: 100% !important; height: 5mm !important;">
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            28</td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: left; padding-left: 1mm !important;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td
                            style="border-bottom: 1px solid #000 !important; border-right: 1px solid #000 !important; text-align: center;">
                            </td>
                        <td style="border-bottom: 1px solid #000 !important; text-align: center; font-weight: bold;">
                            </td>
                    </tr>
                    

                </table>
            </td>
        </tr>

        <!-- Total Section -->
        <tr>
            <td>
                <table style="width: 100% !important; border-bottom: 1px solid #000 !important ;" cellpadding="0"
                    cellspacing="0">
                    <!-- Terms and Conditions & Totals Section -->
                    <tr style="width: 100% !important;">

                        <!-- Terms and Conditions -->
                        <td style="vertical-align: top !important; ">
                            <table
                                style="width: 125mm !important; border-collapse: collapse !important; border: 1px solid #000; background-color: #f2f2f2 !important; margin: 2mm !important;"
                                cellpadding="0" cellspacing="0">
                                <tr style="height: 10mm !important;">
                                    <td
                                        style="border: 1px solid #000 !important; font-size: 12px !important; text-align: center !important; font-weight: bold !important;">
                                        
                                    </td>
                                </tr>
                            </table>
                            <table
                                style="margin: 2mm !important; width: 125mm !important; border-collapse: collapse !important; border: 1px solid #000 !important;"
                                cellpadding="0" cellspacing="0">
                                <tr>
                                    <td
                                        style="padding-left: 2mm !important; padding-top: 2mm !important; font-size: 12px !important; font-weight: bold; margin-bottom: 1mm !important;">
                                        Terms & Conditions :
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 10px !important; padding-left: 2mm !important;">
                                        Thanks for doing business with us.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 10px !important; padding-left: 2mm !important;">
                                        Interest @ 18% percent interest will be charged extra on payments due
                                        after 7 days from the date
                                        of billing.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 10px !important; padding-left: 2mm !important;">
                                        No replacement of broken or damaged goods. Please accept goods in proper
                                        condition only.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 10px !important; padding-left: 2mm !important;">
                                        Goods once sold are not returnable.
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style="font-size: 10px !important; padding-bottom: 2mm !important; padding-left: 2mm !important;">
                                        All Disputes & claims will be referred to the court at Udaipur
                                        jurisdiction.
                                    </td>
                                </tr>
                            </table>
                        </td>

                        <!-- Amount Summary -->
                        <td style="vertical-align: top !important; ">
                            <table
                                style="width: 60mm !important; font-size: 10px !important;  border-collapse: collapse; margin: 2mm !important; border: 1px solid #000;"
                                cellpadding="0" cellspacing="0">
                                <tr style="height: 5mm !important; border-bottom: 1px solid #000 !important;">
                                    <td style="padding-left: 2mm !important; font-weight: bold;">
                                        SUB TOTAL</td>
                                    <td
                                        style="padding-right: 2mm !important; text-align: right !important; border-left: 1px solid #000 !important;">
                                        1000.00</td>
                                </tr>
                                <tr style="height: 5mm !important; border-bottom: 1px solid #000 !important;">
                                    <td style="padding-left: 2mm !important;  font-weight: bold;">
                                        DISCOUNT</td>
                                    <td
                                        style="padding-right: 2mm !important; text-align: right !important; border-left: 1px solid #000 !important;">
                                        0.0</td>
                                </tr>
                                <tr style="height: 5mm !important; border-bottom: 1px solid #000 !important;">
                                    <td style="padding-left: 2mm !important;font-weight: bold;">
                                        TOTAL</td>
                                    <td
                                        style="padding-right: 2mm !important; text-align: right !important; border-left: 1px solid #000 !important;">
                                        1000.00</td>
                                </tr>
                                <tr style="height: 5mm !important; border-bottom: 1px solid #000 !important;">
                                    <td style="padding-left: 2mm !important; font-weight: bold;">
                                        Additional Charges</td>
                                    <td
                                        style="padding-right: 2mm !important; text-align: right !important; border-left: 1px solid #000 !important;">
                                        
                                    </td>
                                </tr>
                                <tr style="height: 5mm !important;">
                                    <td style="padding-left: 2mm !important; font-weight: bold;">
                                        Round Off</td>
                                    <td
                                        style="padding-right: 2mm !important; text-align: right !important; border-left: 1px solid #000 !important;">
                                        0.0</td>
                                </tr>

                            </table>
                            <table
                                style="width: 60mm !important; border-collapse: collapse !important; border: 1px solid #000 !important; background-color: #f2f2f2 !important; margin: 2mm !important;"
                                cellpadding="0" cellspacing="0">
                                <tr style="height: 10mm !important;">
                                    <td
                                        style="border: 1px solid #000 !important; font-size: 12px !important; text-align: center !important; font-weight: bold !important;">
                                        GRAND TOTAL: &#8377; 1000.0
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Signature Section -->
        <tr>
            <td style="padding-top: 4mm !important;">
                <table style="width: 100% !important; border-collapse: collapse !important;" cellpadding="0"
                    cellspacing="0">
                    <tr>
                        <td
                            style="width: 40% !important; text-align: center !important; vertical-align: top !important;">
                            <div
                                style="border-top: 1px solid #000 !important; width: 200px !important; margin: 0 auto 5px auto !important;">
                            </div>
                            <div style="font-weight: bold !important; font-size: 12px !important;">Vikas Auto Ajency
                            </div>
                        </td>
                        <td style="width: 20% !important;">&nbsp;</td>
                        <td
                            style="width: 40% !important; text-align: center !important; vertical-align: top !important;">
                            <div
                                style="border-top: 1px solid #000 !important; width: 200px !important; margin: 0 auto 5px auto !important;">
                            </div>
                            <div style="font-weight: bold !important; font-size: 12px !important;">Quality Auto Parts</div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Motto -->
        <tr>
            <td
                style="text-align: center !important; padding-bottom: 3mm !important; font-size: 14px !important; font-weight: bold !important; color: #C04000; text-decoration: underline !important;">
                LIFE'S A JOURNEY, KEEP SMILING
            </td>
        </tr>

    </table>
    
</body>

</html>`;
