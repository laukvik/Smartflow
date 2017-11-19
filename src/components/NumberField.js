import {InputComponent} from "../InputComponent";

/**
 *
 * @typedef {Object} TextfieldProperties
 * @property {string} type - always Textfield
 * @property {string} label - the label
 * @property {boolean} required - indicates whether the value is required
 * @property {string} value - the value of the Textfield
 * @property {string} placeholder - the placeholder for the Textfield
 *
 */


/**
 * <div>
 *
 * <label for="basic-url">Your vanity URL</label>
 * <div class="input-group">
 *     <span class="input-group-addon" id="basic-addon3">https://example.com/users/</span>
 *     <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3"/>
 * </div>
 *
 * <div>Error message</div>
 * </div>
 */
export class NumberField extends InputComponent {

  /**
   * Constructor for NumberField
   *
   * @param {NumberFieldProperties} props the properties for the component
   */
  constructor() {
    super();
    this._value = null;

    this._inputNode = document.createElement("input");
    this._inputNode.setAttribute("type", "number");

    this._inputNode.setAttribute("class", "form-control");
    this._inputNode.addEventListener('keyup', function () {
      this._valueChanged();
    }.bind(this), false);

    this._before = document.createElement("span");
    this._before.setAttribute("class", "input-group-addon");

    this._after = document.createElement("span");
    this._after.setAttribute("class", "input-group-addon");
  }

  render(){
    return this.getComponentNode();
  }

  setProperty(name, value) {
    if (name === "enabled") {
      this.setEnabled(value);
    } else if (name === "value") {
      this.setValue(value);
    } else if (name === "label") {
      this.setLabel(value);
    } else if (name === "help") {
      this.setHelp(value);
    } else if (name === "required") {
      this.setRequired(value);
    } else if (name === "validation") {
      this.setValidationMessage(value);
    } else if (name === "placeholder") {
      this.setPlaceholder(value);
    } else if (name === "before") {
      this.setBefore(value);
    } else if (name === "after") {
      this.setAfter(value);
    } else if (name === "min") {
      this.setMin(value);
    } else if (name === "max") {
      this.setMax(value);
    } else if (name === "step") {
      this.setStep(value);
    } else {
      console.warn("NumberField: Unknown property ", name);
    }
  }

  setMin(minimum){
      this._inputNode.setAttribute("min", minimum);
  }

  setMax(max){
      this._inputNode.setAttribute("max", max);
  }

  setStep(step){
      this._inputNode.setAttribute("step", step);
  }

  setBefore(text){
    this._before.textContent = text;
    this.updateInputGroup();
  }

  setAfter(text){
    this._after.textContent = text;
    this.updateInputGroup();
  }

  updateInputGroup(){
    this.removeChildNodes(this._inputGroup);
    if (this._before.textContent){
      this._inputGroup.appendChild(this._before);
    }
    this._inputGroup.appendChild(this.getInputElement());
    if (this._after.textContent){
      this._inputGroup.appendChild(this._after);
    }
  }

  getInputElement(){
    return this._inputNode;
  }

  _valueChanged() {
    if (this._value === this.getValue()) {
      return;
    }
    this._value = this.getValue();
    this.firePropertyChanged("value", this._value);
    this.validate();
  }

  isValid() {
    const min = this._inputNode.getAttribute("min");
    const max = this._inputNode.getAttribute("max");
    const v = this._inputNode.value;
    console.info("Valid: ", min, max, v);
    return v >= min && v <= max;
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this._inputNode.removeAttribute("disabled");
    } else {
      this._inputNode.setAttribute("disabled", "true");
    }
  }

  /**
   * he placeholder attribute represents a short hint (a word or short phrase) intended to aid the user
   * with data entry when the control has no value.
   *
   * @param text
   */
  setPlaceholder(text) {
    this._inputNode.setAttribute("placeholder", text === undefined ? "" : text);
  }

  /**
   * Sets the value
   *
   * @param text the value
   */
  setValue(text) {
    this._inputNode.value = text === undefined ? "" : text;
  }

  getValue() {
    let s = this._inputNode.value;
    return s === undefined ? '' : s;
  }

}
