import dynamic from "next/dynamic";

export const toolComponents: Record<string, React.ComponentType> = {
  // Text Tools
  "word-counter": dynamic(() => import("./WordCounter")),
  "case-converter": dynamic(() => import("./CaseConverter")),
  "lorem-ipsum": dynamic(() => import("./LoremIpsum")),
  "text-reverser": dynamic(() => import("./TextReverser")),
  // Math & Calculators
  "percentage-calculator": dynamic(() => import("./PercentageCalculator")),
  "tip-calculator": dynamic(() => import("./TipCalculator")),
  "scientific-calculator": dynamic(() => import("./ScientificCalculator")),
  // Unit Converters
  "length-converter": dynamic(() => import("./LengthConverter")),
  "temperature-converter": dynamic(() => import("./TemperatureConverter")),
  "weight-converter": dynamic(() => import("./WeightConverter")),
  // Finance
  "loan-calculator": dynamic(() => import("./LoanCalculator")),
  "compound-interest": dynamic(() => import("./CompoundInterest")),
  // Health & Fitness
  "bmi-calculator": dynamic(() => import("./BMICalculator")),
  "age-calculator": dynamic(() => import("./AgeCalculator")),
  "calorie-calculator": dynamic(() => import("./CalorieCalculator")),
  // Developer Tools
  "json-formatter": dynamic(() => import("./JSONFormatter")),
  "base64": dynamic(() => import("./Base64Tool")),
  "password-generator": dynamic(() => import("./PasswordGenerator")),
  // Color Tools
  "color-converter": dynamic(() => import("./ColorConverter")),
  // Date & Time
  "date-calculator": dynamic(() => import("./DateCalculator")),
  // PDF Tools
  "image-to-pdf": dynamic(() => import("./ImageToPDF")),
  "merge-pdf": dynamic(() => import("./MergePDF")),
  "split-pdf": dynamic(() => import("./SplitPDF")),
  "compress-pdf": dynamic(() => import("./CompressPDF")),
  "rotate-pdf": dynamic(() => import("./RotatePDF")),
  "remove-pdf-pages": dynamic(() => import("./RemovePDFPages")),
  "watermark-pdf": dynamic(() => import("./WatermarkPDF")),
  "pdf-to-image": dynamic(() => import("./PDFToImage")),
  // Image Tools
  "compress-image": dynamic(() => import("./CompressImage")),
  "resize-image": dynamic(() => import("./ResizeImage")),
  "convert-image": dynamic(() => import("./ConvertImage")),
  "flip-image": dynamic(() => import("./FlipImage")),
  // Text Tools — new
  "text-diff":              dynamic(() => import("./TextDiff")),
  "remove-duplicate-lines": dynamic(() => import("./RemoveDuplicateLines")),
  "text-to-slug":           dynamic(() => import("./TextToSlug")),
  "markdown-preview":       dynamic(() => import("./MarkdownPreview")),
  "find-replace":           dynamic(() => import("./FindReplace")),
  "remove-extra-spaces":    dynamic(() => import("./RemoveExtraSpaces")),
  // Math — new
  "gst-calculator":    dynamic(() => import("./GSTCalculator")),
  "discount-calculator": dynamic(() => import("./DiscountCalculator")),
  "fuel-cost-calculator": dynamic(() => import("./FuelCostCalculator")),
  "roman-numeral":     dynamic(() => import("./RomanNumeral")),
  // Finance — new
  "sip-calculator":    dynamic(() => import("./SIPCalculator")),
  "currency-converter": dynamic(() => import("./CurrencyConverter")),
  "salary-calculator": dynamic(() => import("./SalaryCalculator")),
  "fd-calculator":     dynamic(() => import("./FDCalculator")),
  // Health — new
  "water-intake":          dynamic(() => import("./WaterIntake")),
  "sleep-calculator":      dynamic(() => import("./SleepCalculator")),
  "ideal-weight":          dynamic(() => import("./IdealWeight")),
  "pregnancy-calculator":  dynamic(() => import("./PregnancyCalculator")),
  "heart-rate-zones":      dynamic(() => import("./HeartRateZones")),
  // Developer — new
  "url-encoder":        dynamic(() => import("./URLEncoder")),
  "html-entities":      dynamic(() => import("./HTMLEntities")),
  "jwt-decoder":        dynamic(() => import("./JWTDecoder")),
  "cron-builder":       dynamic(() => import("./CronBuilder")),
  "regex-tester":       dynamic(() => import("./RegexTester")),
  "uuid-generator":     dynamic(() => import("./UUIDGenerator")),
  "hash-generator":     dynamic(() => import("./HashGenerator")),
  "ip-lookup":          dynamic(() => import("./IPLookup")),
  "css-minifier":       dynamic(() => import("./CSSMinifier")),
  // Image — new
  "image-cropper":      dynamic(() => import("./ImageCropper")),
  "watermark-image":    dynamic(() => import("./WatermarkImage")),
  "image-color-picker": dynamic(() => import("./ImageColorPicker")),
  "image-to-base64":    dynamic(() => import("./ImageToBase64")),
  // Productivity
  "ats-score":         dynamic(() => import("./ATSScore")),
  "qr-code-generator": dynamic(() => import("./QRCodeGenerator")),
  "pomodoro-timer":    dynamic(() => import("./PomodoroTimer")),
  "countdown-timer":   dynamic(() => import("./CountdownTimer")),
  "random-number":     dynamic(() => import("./RandomNumber")),
  "coin-flip":         dynamic(() => import("./CoinFlip")),
  "reading-time":      dynamic(() => import("./ReadingTime")),
  "character-limit":   dynamic(() => import("./CharacterLimit")),
  "invoice-generator": dynamic(() => import("./InvoiceGenerator")),
  "typing-speed-test": dynamic(() => import("./TypingSpeedTest")),
  // Utilities
  "timezone-converter":    dynamic(() => import("./TimezoneConverter")),
  "aspect-ratio":          dynamic(() => import("./AspectRatio")),
  "readability-score":     dynamic(() => import("./ReadabilityScore")),
  "number-base-converter": dynamic(() => import("./NumberBaseConverter")),
  "epoch-converter":       dynamic(() => import("./EpochConverter")),
  // New trending tools
  "ai-prompt-generator":   dynamic(() => import("./AIPromptGenerator")),
  "grammar-checker":       dynamic(() => import("./GrammarChecker")),
  "plagiarism-checker":    dynamic(() => import("./PlagiarismChecker")),
  "tax-regime-calculator": dynamic(() => import("./TaxRegimeCalculator")),
  // Education & Career
  "cgpa-calculator":          dynamic(() => import("./CGPACalculator")),
  "loan-eligibility":         dynamic(() => import("./LoanEligibility")),
  "notice-period-calculator": dynamic(() => import("./NoticePeriodCalculator")),
  "cover-letter-generator":   dynamic(() => import("./CoverLetterGenerator")),
  // PDF Extended Tools
  "sign-pdf": dynamic(() => import("./SignPDF")),
  "unlock-pdf": dynamic(() => import("./UnlockPDF")),
  "page-numbers-pdf": dynamic(() => import("./PageNumbersPDF")),
  "crop-pdf": dynamic(() => import("./CropPDF")),
  "edit-pdf": dynamic(() => import("./EditPDF")),
  "reorder-pdf": dynamic(() => import("./ReorderPDF")),
  "header-footer-pdf": dynamic(() => import("./HeaderFooterPDF")),
  "flatten-pdf": dynamic(() => import("./FlattenPDF")),
  "grayscale-pdf": dynamic(() => import("./GrayscalePDF")),
  // Office Tools
  "word-to-pdf": dynamic(() => import("./WordToPDF")),
  "word-to-text": dynamic(() => import("./WordToText")),
  "excel-to-csv": dynamic(() => import("./ExcelToCSV")),
  "csv-to-excel": dynamic(() => import("./CSVToExcel")),
  "excel-to-pdf": dynamic(() => import("./ExcelToPDF")),
  "pdf-to-text": dynamic(() => import("./PDFToText")),
  "pdf-to-word": dynamic(() => import("./PDFToWord")),
};
